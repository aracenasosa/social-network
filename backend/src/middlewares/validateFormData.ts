// middleware/validateFormData.ts
import { Request, Response, NextFunction } from "express";

type RequiredFormDataOptions = {
  fields?: string[]; // required text fields
  requireFiles?: boolean; // require at least 1 file
};

export const validateFormData = ({
  fields = [],
  requireFiles = false,
}: RequiredFormDataOptions) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields: string[] = [];

    // ✅ Validate text fields (form-data text)
    for (const field of fields) {
      const value = req.body?.[field];

      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        missingFields.push(field);
      }
    }

    // ✅ Validate files (form-data files)
    const files = (req.files as Express.Multer.File[]) || [];
    if (requireFiles && files.length === 0) {
      missingFields.push("media");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required form-data fields",
        missingFields,
      });
    }

    next();
  };
};

/**
 * Middleware to ensure form-data or body is not completely empty
 */
export const validateFormDataIsNotEmpty = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hasBody = req.body && Object.keys(req.body).length > 0;
  const hasFile = !!req.file;
  const hasFiles = !!(req.files && (req.files as any).length > 0);

  if (!hasBody && !hasFile && !hasFiles) {
    return res.status(400).json({
      message: "At least one field or file is required for this update",
    });
  }
  next();
};
