// import { Order } from "../models/order.js";
// import { Cart } from "../models/cart.js";
// import { Product } from "../models/product.js";

// export const newOrder = async (req, res) => {
//   try {
//     const userID = req.user.id;

//     const cart = await Cart.findOne({ user: userID }).populate("items.product");

//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     let total = 0;

//     for (const item of cart.items) {
//       if (item.product.stock < item.quantity) {
//         return res.status(400).json({
//           message: `${item.product.name} is out of stock`,
//         });
//       }
//       total += item.product.price * item.quantity;
//     }

//     const order = await Order.create({
//       user: userID,
//       items: cart.items.map((item) => ({
//         product: item.product._id,
//         quantity: item.quantity,
//         price: item.product.price,
//       })),
//       totalAmount: total,
//     });

//     for (const item of cart.items) {
//       await Product.findByIdAndUpdate(item.product._id, {
//         $inc: { stock: -item.quantity },
//       });
//     }

//     cart.items = [];
//     await cart.save();

//     res.status(201).json({
//       message: "Order placed successfully",
//       order,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// export const getMyOrders = async (req, res) => {
//   try {
//     const userID = req.user.id;
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const orders = await Order.find({ user: userID })
//       .populate("items.product")
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);
//     const total = await Order.countDocuments({ user: userID });
//     res.status(200).json({
//       page,
//       totalPages: Math.ceil(total / limit),
//       totalOrder: total,
//       orders,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
// export const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate("items.product")
//       .populate("user");
//     if (!order) return res.status(404).json({ message: "Order not found" });
//     if (
//       req.user.role !== "admin" &&
//       order.user._id.toString() !== req.user.id
//     ) {
//       return res.status(403).json({ message: "Access Denied" });
//     }
//     res.json({ order });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
// export const getAllOrders = async (req, res) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 20;
//     const skip = (page - 1) * limit;
//     const orders = await Order.find()
//       .populate("user")
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);
//     const total = await Order.countDocuments();
//     res.json({
//       page,
//       totalPages: Math.ceil(total / limit),
//       totalOrders: total,
//       orders,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// export const cancelOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     if (req.user.role !== "admin" && order.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     if (order.status !== "pending") {
//       return res.status(400).json({ message: "order cannot be cancelled" });
//     }
//     for (const item of order.items) {
//       await Product.findByIdAndUpdate(item.product, {
//         $inc: { stock: item.quantity },
//       });
//     }
//     order.status = "cancelled";
//     await order.save();
//     res.json({ message: "Order cancelled and Stock restored" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

//chat Gpt la billa hannyo

import mongoose from "mongoose";
import { Order } from "../models/order.js";
import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";

const paginate = (page = 1, limit = 10) => {
  const p = Number(page) || 1;
  const l = Number(limit) || 10;
  const skip = (p - 1) * l;
  return { skip, limit: l, page: p };
};

export const newOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userID = req.user.id;

    const cart = await Cart.findOne({ user: userID })
      .populate("items.product")
      .session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `${item.product.name} is out of stock`,
        });
      }
      total += item.product.price * item.quantity;
    }

    const order = await Order.create(
      [
        {
          user: userID,
          items: cart.items.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          totalAmount: total,
        },
      ],
      { session }
    );

    await Promise.all(
      cart.items.map((item) =>
        Product.findByIdAndUpdate(
          item.product._id,
          { $inc: { stock: -item.quantity } },
          { session }
        )
      )
    );

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Order placed successfully",
      order: order[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const { skip, limit, page } = paginate(req.query.page, req.query.limit);

    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: req.user.id });

    res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access Denied" });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { skip, limit, page } = paginate(req.query.page, req.query.limit);

    const orders = await Order.find()
      .populate("user")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments();

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findById(req.params.id).session(session);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin" && order.user.toString() !== req.user.id) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Access denied" });
    }

    if (order.status !== "pending") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    await Promise.all(
      order.items.map((item) =>
        Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } },
          { session }
        )
      )
    );

    order.status = "cancelled";
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Order cancelled and stock restored" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
