import { createSupabaseServerClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export async function logAudit(
  supabase: SupabaseServerClient,
  params: {
    tenantId: string;
    userId: string | undefined;
    tableName: string;
    recordId: string | null;
    action: "insert" | "update" | "delete";
    oldValue: unknown;
    newValue: unknown;
  },
) {
  await supabase.from("audit_log").insert({
    tenant_id: params.tenantId,
    user_id: params.userId ?? null,
    table_name: params.tableName,
    record_id: params.recordId,
    action: params.action,
    old_value: params.oldValue as never,
    new_value: params.newValue as never,
  });
}
