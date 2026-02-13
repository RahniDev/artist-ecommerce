import {Router} from "express";

import { requireSignin, isAuth, isAdmin } from "../auth/auth.controller";
import { userById, addOrderToUserHistory } from "../user/user.controller";
import {
    create,
    listOrders,
    getStatusValues,
    orderById,
    updateOrderStatus
} from "./order.controller.js";
import { decreaseQuantity } from "../product/product.controller.js";

const router: Router = Router();

router.post(
    "/order/create/:userId",
    requireSignin,
    isAuth,
    addOrderToUserHistory,
    decreaseQuantity,
    create
);

router.get("/order/list/:userId", requireSignin, isAuth, isAdmin, listOrders);
router.get(
    "/order/status-values/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    getStatusValues
);
router.put(
    "/order/:orderId/status/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    updateOrderStatus
);

router.param("userId", userById);
router.param("orderId", orderById);

export default router;