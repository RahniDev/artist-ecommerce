import { Request, Response, NextFunction } from "express";
import { User, IUser } from "../user/user.model.js";
import { Order } from "../order/order.model.js";
import { errorHandler } from "../../helpers/errorHandler.js";

interface CustomRequest extends Request {
  profile?: IUser;
}

export const userById = async (req: CustomRequest, res: Response, next: NextFunction, id: string) => {
  try {
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Get user profile
export const read = (req: CustomRequest, res: Response) => {
  if (!req.profile) return res.status(404).json({ error: "User not found" });

  const { hashed_password, salt, ...userData } = req.profile.toObject();
  res.json(userData);
};

export const update = async (req: CustomRequest, res: Response) => {
  if (!req.profile) return res.status(404).json({ error: "User not found" });

  const { name, password } = req.body;

  if (!name) return res.status(400).json({ error: "Name is required" });
  if (password && password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });

  try {
    const user = req.profile;
    user.name = name;
    if (password) user.password = password;

    const updatedUser = await user.save();

    const { hashed_password, salt, ...userData } = updatedUser.toObject();
    res.json(userData);
  } catch (err) {
    res.status(400).json({ error: "User update failed" });
  }
};

// Add order to user purchase history
export const addOrderToUserHistory = async (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.profile) return res.status(404).json({ error: "User not found" });

  const history = req.body.order.products.map((item: any) => ({
    _id: item._id,
    name: item.name,
    description: item.description,
    category: item.category,
    quantity: item.count,
    transaction_id: req.body.order.transaction_id,
    amount: req.body.order.amount,
  }));

  try {
    await User.findByIdAndUpdate(req.profile._id, { $push: { history } }, { new: true }).exec();
    next();
  } catch (err) {
    res.status(400).json({ error: "Could not update user purchase history" });
  }
};

export const purchaseHistory = async (req: CustomRequest, res: Response) => {
  if (!req.profile) return res.status(404).json({ error: "User not found" });

  try {
    const orders = await Order.find({ user: req.profile._id })
      .populate("user", "_id name")
      .sort("-created")
      .exec();

    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: errorHandler(err) });
  }
};