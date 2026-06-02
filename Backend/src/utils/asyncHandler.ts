import { Request, Response, NextFunction, RequestHandler } from "express";

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any> | any
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.log("asyncHandler caught error:", err.message);
      if (typeof next === "function") {
        next(err);
      } else {
        res.status(500).json({ message: err.message });
      }
    });
  };
}
