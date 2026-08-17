import MenuItem, { IMenuItem } from "./menu.model";

export const getAvailableMenuItems = async (): Promise<IMenuItem[]> => {
  return MenuItem.find({ isAvailable: true });
};
