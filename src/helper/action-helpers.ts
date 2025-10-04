import { ServerActionReturn } from "@/types/server-action";

export function successResponse<T = void>(
  data?: T,
  message?: string
): ServerActionReturn<T> {
  return { success: true, data, message };
}

export function errorResponse(
  message: string,
  code?: string,
  details?: any
): ServerActionReturn<never> {
  return { success: false, error: { message, code, details } };
}
