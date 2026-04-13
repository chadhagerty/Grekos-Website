import { createSupabaseServerClient } from "./supabase-server";

const DEV_ADMIN_BYPASS = false;

export async function requireAdminUser() {
  if (process.env.NODE_ENV !== "production" && DEV_ADMIN_BYPASS) {
    return {
      user: {
        id: "dev-admin",
        email: "dev@local.test",
      } as any,
      error: null,
    };
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, error: "Unauthorized" };
  }

  return { user, error: null };
}
