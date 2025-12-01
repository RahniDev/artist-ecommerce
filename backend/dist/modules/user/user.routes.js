import { Router } from "express";
import { requireSignin, isAuth, isAdmin } from "../auth/auth.controller.js";
import { userById, read, update, purchaseHistory } from "./user.controller.js";
const router = Router();
// Private route accessible only by admin
router.get("/admin/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile,
    });
});
router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);
router.get("/orders/by/user/:userId", requireSignin, isAuth, purchaseHistory);
router.param("userId", userById);
export default router;
