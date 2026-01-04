import { Product } from "../models/product.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      image,
    });
    res.status(201).json({ message: "product added sucessfuly", product });
  } catch (error) {
    console.log(error);
  }
};

export const getProductById = async (req, res) => {
  try {
    const productID = req.params.id;

    const product = await Product.findById({ _id: productID });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "product get successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const product = await Product.findByIdAndDelete({ _id: productID });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const product = await Product.findByIdAndUpdate(productID, req.body, {
      new: true,
    });
    res.status(201).json({ message: "Product updated sucessfully", product });
  } catch (error) {
    console.log(error);
  }
};
export const searchProduct = async (req, res) => {
  try {
    const { q } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const filter = {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    };

    const products = await Product.find(filter).skip(skip).limit(limit);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      message: "Products found",
      page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);

    const total = await Product.countDocuments();

    res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
