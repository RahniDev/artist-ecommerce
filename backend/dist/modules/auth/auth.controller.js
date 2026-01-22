import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../user/user.model.js";
import { errorHandler } from "../../helpers/errorHandler.js";
export const signup = async (req, res) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        // remove sensitive fields
        savedUser.hashed_password = undefined;
        savedUser.salt = undefined;
        return res.json({ user: savedUser });
    }
    catch (err) {
        return res.status(400).json({
            error: err.code === 11000 ? "Email is already registered" : errorHandler(err)
        });
    }
};
export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select("+hashed_password +salt");
        if (!user) {
            return res.status(400).json({
                error: "User with that email does not exist. Please sign up."
            });
        }
        const match = await bcrypt.compare(password, user.hashed_password);
        if (!match) {
            return res.status(401).json({ error: "Email and password do not match" });
        }
        // generate JWT
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d"
        });
        // set secure cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        const { _id, name, role } = user;
        return res.json({
            token,
            user: { _id, name, email, role }
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Login failed" });
    }
};
export const signout = (req, res) => {
    res.clearCookie("token");
    return res.json({ message: "Signed out successfully" });
};
export const requireSignin = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Authentication required" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.auth = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
export const isAuth = (req, res, next) => {
    const sameUser = req.profile && req.auth && req.profile._id.toString() === req.auth._id;
    if (!sameUser) {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
};
export const isAdmin = (req, res, next) => {
    if (req.profile?.role !== 1) {
        return res.status(403).json({ error: "Admin resource. Access denied." });
    }
    next();
};
