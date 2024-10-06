import productSchema from "../model/product.js";
import { pagination } from "../common/index.js";
import orderSchema from "../model/order.js";
import mongoose from "mongoose";

const productList = async (req, res) => {
  try {
    const { search, pageLimit, pageNumber } = req.query;
    const { offset, limits } = pagination.paginationData(pageLimit, pageNumber);

    // Prepare match conditions
    const matchConditions = {};
    if (search) {
      const searchRegex = new RegExp(search, "i"); // 'i' for case-insensitive search
      matchConditions.$or = [
        { name: searchRegex },
        { "categories.name": searchRegex }, // Match by category name
      ];
    }

    // Aggregation pipeline
    const data = await productSchema.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $match: matchConditions,
      },
      {
        $skip: offset,
      },
      {
        $limit: limits,
      },
    ]);

    return res.status(200).json({
      message: "Product list retrieved successfully.",
      dataLength: data.length,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const addProductToCard = async (req, res) => {
  try {
    const { product_id } = req.body;
    const { _id } = req.currentUser;
    const productData = await productSchema.findOne({ _id: product_id });

    if (!productData) {
      return res.status(400).json({ message: "Product is not exist" });
    }

    if (
      productData.stock_quantity === null ||
      productData.stock_quantity === undefined ||
      isNaN(productData.stock_quantity)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid stock quantity for the product" });
    }

    if (productData.stock_quantity <= 0) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    await orderSchema.create({
      user_id: _id,
      product_id: product_id,
    });

    const newStockQuantity = productData.stock_quantity - 1;

    if (newStockQuantity < 0) {
      return res
        .status(400)
        .json({ message: "Product stock is insufficient for this order." });
    }

    await productSchema.findOneAndUpdate(
      { _id: product_id },
      { $set: { stock_quantity: newStockQuantity } }
    );

    return res
      .status(200)
      .json({ message: "Product add to cart successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const productAddToCardList = async (req, res) => {
  try {
    const { _id } = req.currentUser;
    const { pageLimit, pageNumber } = req.query;
    const { offset, limits } = pagination.paginationData(pageLimit, pageNumber);

    // The _id of the user is an ObjectId if necessary
    const userId = new mongoose.Types.ObjectId(_id);

    const data = await orderSchema.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "products",
        },
      },
      {
        $match: { user_id: userId, status: "pending" },
      },
      {
        $skip: offset,
      },
      {
        $limit: limits,
      },
    ]);
    return res.status(200).json({
      message: "product add to card list fetched successfully",
      dataLength: data.length,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const crateOrder = async (req, res) => {
  try {
    const { _id } = req.body;
    const productData = await orderSchema.findOne({ _id: _id });

    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }

    await orderSchema.findOneAndUpdate(
      { _id },
      { $set: { status: "processing" } }
    );

    return res.status(200).json({ message: "order created successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const removeProdcut = async (req, res) => {
  try {
    const { _id } = req.params;
    const productData = await orderSchema.findOne({ _id: _id });

    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }

    await orderSchema.findByIdAndDelete({ _id });

    return res
      .status(200)
      .json({ message: "product remove from add to card successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const orderList = async (req, res) => {
  try {
    const { _id } = req.currentUser;
    const { pageLimit, pageNumber } = req.query;
    const { offset, limits } = pagination.paginationData(pageLimit, pageNumber);

    const userId = new mongoose.Types.ObjectId(_id);

    const data = await orderSchema.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "products",
        },
      },
      {
        $match: {
          user_id: userId,
          status: { $in: ["processing", "shipped", "delivered"] },
        },
      },
      {
        $skip: offset,
      },
      {
        $limit: limits,
      },
    ]);
    return res.status(200).json({
      message: "order list fetched successfully",
      dataLength: data.length,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export default {
  productList,
  addProductToCard,
  productAddToCardList,
  removeProdcut,
  crateOrder,
  orderList,
};
