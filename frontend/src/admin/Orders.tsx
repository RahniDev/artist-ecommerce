import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { listOrders, getStatusValues, updateOrderStatus } from "./apiAdmin";
import moment from "moment";
import type { ApiResponse, IOrder, IAuthData } from "../types";



type Status = string[];


const Orders: React.FC = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [statusValues, setStatusValues] = useState<Status>([]);

    const { user, token } = isAuthenticated() as IAuthData;

    const loadOrders = async () => {
        try {
            const data: ApiResponse<IOrder[]> = await listOrders(user._id, token);
            if (data.error) {
                console.error(data.error);
            } else {
                setOrders(data.data || []);
            }
        } catch (err) {
            console.error("Failed to load orders", err);
        }
    };

    const loadStatusValues = async () => {
        try {
            const data = await getStatusValues(user._id, token);
            setStatusValues(data);
        } catch (err) {
            console.error("Failed to load status values", err);
        }
    };


    useEffect(() => {
        loadOrders();
        loadStatusValues();
    }, []);

    const handleStatusChange = async (e: ChangeEvent<HTMLSelectElement>, orderId: string) => {
        try {
            const data: ApiResponse<IOrder> = await updateOrderStatus(user._id, token, orderId, e.target.value);
            if (data.error) {
                console.error("Status update failed:", data.error);
            } else {
                await loadOrders();
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const showOrdersLength = () =>
        orders.length > 0 ? (
            <h1 className="text-danger display-2">Total orders: {orders.length}</h1>
        ) : (
            <h1 className="text-danger">No orders</h1>
        );

    // read-only input
    const showInput = (key: string, value: string | number) => (
        <div className="input-group mb-2 mr-sm-2">
            <div className="input-group-prepend">
                <div className="input-group-text">{key}</div>
            </div>
            <input type="text" value={value} className="form-control" readOnly />
        </div>
    );

    // Show order status selector
    const showStatus = (order: IOrder) => (
        <div className="form-group">
            <h3 className="mark mb-4">Status: {order.status}</h3>
            <select
                className="form-control"
                onChange={(e) => handleStatusChange(e, order._id)}
            >
                <option>Update Status</option>
                {statusValues.map((status, index) => (
                    <option key={index} value={status}>
                        {status}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <Layout
            title="Orders"
            description={`Hi ${user.name}, you can manage the orders here.`}
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showOrdersLength()}
                    {orders.map((o) => (
                        <div
                            className="mt-5"
                            key={o._id}
                            style={{ borderBottom: "5px solid indigo" }}
                        >
                            <h2 className="mb-5">
                                <span className="bg-primary">Order ID: {o._id}</span>
                            </h2>
                            <ul className="list-group mb-2">
                                <li>{showStatus(o)}</li>
                                <li>Transaction ID: {o.transaction_id}</li>
                                <li>Amount: £{o.amount}</li>
                                <li>Ordered by: {o.user.name}</li>
                                <li>Ordered on: {moment(o.createdAt).fromNow()}</li>
                                <li>Delivery Address: {o.address}</li>
                            </ul>

                            <h3 className="mt-4 mb-4 font-italic">
                                Total products in the order: {o.products.length}
                            </h3>

                            {o.products.map((p) => (
                                <div
                                    className="mb-4"
                                    key={p._id}
                                    style={{ padding: "20px", border: "1px solid indigo" }}
                                >
                                    {showInput("Product name", p.name)}
                                    {showInput("Product price", p.price)}
                                    {showInput("Product total", p.count ?? 0)}
                                    {showInput("Product Id", p._id)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Orders;
