import jwt from "jsonwebtoken";
import User, { IUser } from "./user.model";
import { RegisterInput, LoginInput } from "./auth.validation";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

const generateToken = (user: IUser): string => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const register = async (input: RegisterInput) => {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw Object.assign(new Error("Email already registered"), { statusCode: 400 });
  }

  const user = await User.create(input);
  const token = generateToken(user);

  return {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

export const login = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email });
  if (!user) {
    throw Object.assign(new Error("Invalid email or password"), { statusCode: 401 });
  }

  const isMatch = await user.comparePassword(input.password);
  if (!isMatch) {
    throw Object.assign(new Error("Invalid email or password"), { statusCode: 401 });
  }

  const token = generateToken(user);

  return {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }
  return user;
};
