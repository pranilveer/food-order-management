import { Request, Response, NextFunction } from "express";
import { register, login, getMe } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.validation";

export const registerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.errors.map((e) => e.message).join(", "),
      });
      return;
    }

    const result = await register(parsed.data);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.errors.map((e) => e.message).join(", "),
      });
      return;
    }

    const result = await login(parsed.data);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await getMe((req as any).user.userId);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
