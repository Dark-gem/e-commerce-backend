import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";

// export const addtocart = async (req, res) => {
//   try {
//     const { productId, qty } = req.body;
//     const userId = req.user.id;
//     if (!productId || !qty) {
//       return res.status(400).json({ message: "ProductId and qty required" });
//     }

//     let cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       cart = await Cart.create({
//         user: userId,
//         items: [{ product: productId, quantity: qty }],
//       });
//     } else {
//       const itemIndex = cart.items.findIndex(
//         (item) => item.product && item.product.toString() === productId
//       );

//       if (itemIndex > -1) {
//         cart.items[itemIndex].quantity += qty;
//       } else {
//         cart.items.push({ product: productId, quantity: qty });
//       }
//     }

//     await cart.save();
//     res.status(200).json({ message: "Added to cart", cart });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const addtocart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array required" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    for (const { productId, qty } of items) {
      if (!productId || qty <= 0) {
        return res.status(400).json({ message: "Invalid productId or qty" });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += qty;
      } else {
        cart.items.push({ product: productId, quantity: qty });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array required" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    for (const { productId, qty } of items) {
      const index = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (index === -1) continue;

      if (qty <= 0) {
        cart.items.splice(index, 1);
      } else {
        cart.items[index].quantity = qty;
      }
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getUserCart = async (req, res) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    return res.status(200).json({ message: "Cart is empty", cart: null });
  }

  res.status(200).json({ message: "Cart fetched", cart });
};

// export const updateCart = async (req, res) => {
//   console.log("test update card");
//   try {
//     const { productId, qty } = req.body || {};
//     const userId = req.user.id;
//     if (!productId || !qty) {
//       return res.status(400).json({ message: "ProductId and qty required" });
//     }

//     const cart = await Cart.findOne({ user: userId });
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     const itemIndex = cart.items.findIndex(
//       (item) => item.product && item.product.toString() === productId
//     );

//     if (itemIndex === -1) {
//       return res.status(404).json({ message: "Item not found in cart" });
//     }

//     if (qty === 0) {
//       cart.items.splice(itemIndex, 1); // it remove item
//       return res.status(400).json({ message: "Quantity must be >= 0" });
//     } else if (qty > 0) {
//       cart.items[itemIndex].quantity = qty;
//     }

//     await cart.save();
//     res.status(200).json({ message: "Cart updated", cart });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
