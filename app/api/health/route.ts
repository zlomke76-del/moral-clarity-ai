// lazy import to keep route light if env is missing
const { supabaseServer } = await import("@/lib/supabase");

// create server-side supabase client
const sb = await supabaseServer();

