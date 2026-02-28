import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/database.js';
import compression from "compression";
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';
import categoryRoutes from './modules/category/category.routes.js';
import productRoutes from './modules/product/product.routes.js';
import orderRoutes from './modules/order/order.routes.js';
import braintreeRoutes from './modules/braintree/braintree.routes.js';
import contactRoutes from './modules/contact/contact.routes.js';
import shippingRoutes from "./modules/shipping/shipping.routes.js";
const app = express();
app.use(compression());
await connectDB();
app.use(morgan('dev'));
app.use(cookieParser());
app.use((req, res, next) => {
    if (req.headers["content-type"]?.includes("multipart/form-data")) {
        return next();
    }
    express.json()(req, res, next);
});
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', braintreeRoutes);
app.use('/api', contactRoutes);
app.use("/api/shipping", shippingRoutes);
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
