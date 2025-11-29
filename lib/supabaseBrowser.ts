// lib/supabaseBrowser.ts
// Back-compat shim that forwards to the new browser client helpers.

import { supabaseBrowser, createSupabaseBrowser } from "./supabase/client";

// Old code sometimes expects a default export and sometimes a named helper.
// - default export: function returning a Supabase client
// - named export: createSupabaseBrowser()

export default supabaseBrowser;
export { supabaseBrowser, createSupabaseBrowser };
