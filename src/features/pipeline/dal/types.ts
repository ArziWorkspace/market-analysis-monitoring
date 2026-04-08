export type DALError = "no_data" | "db_error" | "unknown_error"

export type DALReturn<T> =
  | { success: true; data: T }
  | { success: false; error: DALError }

export function dalVerifySuccess<T>(result: DALReturn<T>): T {
  if (!result.success) {
    throw new Error(`DAL error: ${result.error}`)
  }
  return result.data
}
