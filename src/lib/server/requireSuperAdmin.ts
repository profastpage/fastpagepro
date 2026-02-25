import { DecodedIdToken } from "firebase-admin/auth";
import { isRootAdminEmail } from "@/lib/adminAccess";

export function assertSuperAdmin(decodedUser: Pick<DecodedIdToken, "email">) {
  if (!isRootAdminEmail(decodedUser?.email)) {
    throw new Error("FORBIDDEN: super admin only");
  }
}
