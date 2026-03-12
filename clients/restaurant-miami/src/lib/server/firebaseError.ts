export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return String(error.message || "");
  return String(error || "");
}

export function isFirebaseAdminCredentialError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes("could not load the default credentials") ||
    message.includes("failed to fetch a valid google oauth2 access token") ||
    message.includes("error fetching access token") ||
    message.includes("invalid_grant")
  );
}

export function isFirebaseProjectConfigError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes("unable to detect a project id") ||
    message.includes("missing-project-id") ||
    message.includes("project_id")
  );
}
