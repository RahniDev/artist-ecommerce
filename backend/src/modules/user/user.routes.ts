import { Router } from "express";
import { requireSignin, isAuth, isAdmin } from "../auth/auth.controller.js";
import { userById, read, update, purchaseHistory } from "./user.controller.js";

const router = Router();

router.param("userId", userById);
// Private route accessible only by admin
router.get("/admin/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: (req as any).profile,
  });
});

router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);
router.get("/orders/by/user/:userId", requireSignin, isAuth, purchaseHistory);


export default router;
