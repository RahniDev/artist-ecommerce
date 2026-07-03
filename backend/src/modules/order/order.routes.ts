import { Router } from "express";

import { requireSignin, isAuth, isAdmin, optionalSignin } from "../auth/auth.controller.js";
import { userById, addOrderToUserHistory, loadProfileFromAuth } from "../user/user.controller.js";
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
    "/orders/create",
    optionalSignin,
    loadProfileFromAuth,
    addOrderToUserHistory,
    decreaseQuantity,
    create
);

router.get("/orders/list/:userId", requireSignin, isAuth, isAdmin, listOrders);
router.get(
    "/orders/status-values/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    getStatusValues
);
router.put(
    "/orders/:orderId/status/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    updateOrderStatus
);

router.param("userId", userById);
router.param("orderId", orderById);

export default router;