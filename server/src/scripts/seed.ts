import mongoose from "mongoose";
import dotenv from "dotenv";
import MenuItem from "../modules/menu/menu.model";

dotenv.config();

const menuItems = [
  {
    name: "Margherita Pizza",
    description: "Classic tomato and mozzarella pizza with fresh basil",
    price: 29900,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400",
    isAvailable: true,
  },
  {
    name: "Pepperoni Pizza",
    description: "Loaded with spicy pepperoni and melted mozzarella cheese",
    price: 34900,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
    isAvailable: true,
  },
  {
    name: "BBQ Chicken Pizza",
    description: "Grilled chicken, BBQ sauce, red onions, and cilantro",
    price: 37900,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    isAvailable: true,
  },
  {
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with cheddar cheese, lettuce, and tomato",
    price: 19900,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    isAvailable: true,
  },
  {
    name: "Paneer Burger",
    description: "Grilled paneer patty with mint chutney, onion, and tomato",
    price: 21900,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
    isAvailable: true,
  },
  {
    name: "Mushroom Swiss Burger",
    description: "Beef patty with sautéed mushrooms and melted Swiss cheese",
    price: 22900,
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400",
    isAvailable: true,
  },
];

const seedDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    await MenuItem.deleteMany({});
    console.log("Cleared existing menu items");

    await MenuItem.insertMany(menuItems);
    console.log(`Seeded ${menuItems.length} menu items`);

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDB();
