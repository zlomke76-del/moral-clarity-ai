import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin':
    process.env.ALLOWED_ORIGIN ?? '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function OPTIONS() {
  return NextResponse.json(null, { headers: corsHeaders })
}

export async function POST(req: Request) {
  try {
    // Detect content type and parse body
    const contentType = req.headers.get('content-type') || ''
    let email = ''

    if (contentType.includes('application/json')) {
      const data = await req.json().catch(() => ({}))
      email =
        data?.email ||
        data?.['Newsletter-Email'] ||
        data?.['newsletter_email'] ||
        ''
    } else if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const form = await req.formData()
      email =
        (form.get('email') as string) ||
        (form.get('Newsletter-Email') as string) ||
        (form.get('newsletter_email') as string) ||
        ''
    } else {
      // Try both parsers defensively
      try {
        const data = await req.json()
        email =
          data?.email ||
          data?.['Newsletter-Email'] ||
          data?.['newsletter_email'] ||
          ''
      } catch {
        const form = await req.formData().catch(() => null)
        if (form) {
          email =
            (form.get('email') as string) ||
            (form.get('Newsletter-Email') as string) ||
            (form.get('newsletter_email') as string) ||
            ''
        }
      }
    }

    // Basic validation
    if (
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { ok: false, message: 'Valid email required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Server-side Supabase client (service role)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Insert into "subscribers" (unique email)
    const { error } = await supabase
      .from('subscribers')
      .insert({ email })
      .select()
      .single()

    // Treat duplicate key as success (idempotent UX)
    const isDuplicate =
      error?.message?.toLowerCase().includes('duplicate') ||
      error?.code === '23505'

    if (error && !isDuplicate) {
      return NextResponse.json(
        { ok: false, message: error.message ?? 'Insert failed' },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { ok: true },
      { status: 200, headers: corsHeaders }
    )
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message ?? 'Server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
