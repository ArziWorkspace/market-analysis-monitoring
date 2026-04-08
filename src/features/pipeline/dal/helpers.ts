import type { DALReturn, DALError } from "./types"

export async function dalDbOperation<T>(
  operation: () => Promise<T>
): Promise<DALReturn<T>> {
  try {
    const data = await operation()
    return { success: true, data }
  } catch (err) {
    console.error("DAL operation failed:", err)
    return { success: false, error: "unknown_error" }
  }
}
