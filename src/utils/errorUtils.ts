
export const sanitizeError = (error: any) => {
  // If error is user-facing, return only safe info
  if (error && (error.message || typeof error === "string")) {
    // Avoid leaking error.stack, sql, details etc.
    if (
      String(error.message).toLowerCase().includes("supabase") ||
      String(error.message).toLowerCase().includes("sql") ||
      String(error.message).toLowerCase().includes("stack") ||
      String(error.message).toLowerCase().includes("column") ||
      String(error.message).toLowerCase().includes("trace")
    ) {
      return "Ocurrió un error inesperado. Por favor intenta de nuevo.";
    }
    return error.message || String(error);
  }
  return "Ocurrió un error inesperado. Por favor intenta de nuevo.";
};
