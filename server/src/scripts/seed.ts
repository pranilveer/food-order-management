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
  {
    name: "Creamy Garlic Pasta",
    description: "Penne in creamy garlic sauce with parmesan and herbs",
    price: 24900,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    isAvailable: true,
  },
  {
    name: "Chicken Tenders",
    description: "Crispy golden fried chicken tenders with honey mustard dip",
    price: 17900,
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400",
    isAvailable: true,
  },
  {
    name: "Caesar Salad",
    description: "Romaine lettuce, croutons, parmesan with classic Caesar dressing",
    price: 19900,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    isAvailable: true,
  },
  {
    name: "Veggie Wrap",
    description: "Grilled vegetables, hummus, and fresh greens in a whole wheat wrap",
    price: 15900,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400",
    isAvailable: true,
  },
  {
    name: "Iced Lemon Tea",
    description: "Refreshing cold tea with fresh lemon and mint",
    price: 7900,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    isAvailable: true,
  },
  {
    name: "Chocolate Brownie",
    description: "Warm chocolate brownie with a scoop of vanilla ice cream",
    price: 14900,
    image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400",
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
