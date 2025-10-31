import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (result.success) {
    // Optionally use parsed data to ensure types downstream
    req.body = result.data;
    return next();
  }

  const error = result.error;
  if (error instanceof ZodError) {
    const errors = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors,
    });
  }

  return res.status(400).json({
    success: false,
    message: "Invalid request payload",
  });
};


