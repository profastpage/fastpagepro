export const ROOT_ADMIN_EMAIL = "afiliadosprobusiness@gmail.com";

export function normalizeEmail(value: string | null | undefined): string {
  return String(value || "").trim().toLowerCase();
}

export function isRootAdminEmail(value: string | null | undefined): boolean {
  return normalizeEmail(value) === ROOT_ADMIN_EMAIL;
}
