import { z } from "zod";

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string; validationErrors?: Record<string, string[] | undefined> };

export class AppError extends Error {
  constructor(
    public override message: string,
    public code: string = "INTERNAL_ERROR",
    public status: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export async function handleAction<T>(action: () => Promise<T>): Promise<ActionResponse<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error: unknown) {
    console.error("[Action Error]:", error);
    
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Input validation failed",
        code: "VALIDATION_ERROR",
        validationErrors: error.flatten().fieldErrors,
      };
    }
    
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: message, code: "UNKNOWN_ERROR" };
  }
}
