import { Request, Response, NextFunction } from "express";
import { getAvailableMenuItems } from "./menu.service";

export const getMenu = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items = await getAvailableMenuItems();
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};
