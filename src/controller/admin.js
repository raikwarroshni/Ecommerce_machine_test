import productSchema from "../model/product.js";
import categorySchema from "../model/category.js";
import orderSchmea from "../model/order.js";

const createproduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, category_id } = req.body;
    const fileData = req.file;

    const data = await productSchema.create({
      name,
      description,
      price,
      stock_quantity,
      category_id,
      image: fileData?.filename,
    });
    return res
      .status(201)
      .json({ message: "product created successfully", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const updateproduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock_quantity,
      category_id,
      product_id,
    } = req.body;
    const fileData = req.file;
    const productData = await productSchema.findOne({ _id: product_id });
    if (!productData) {
      return res.status(400).json({ message: "product is not exist" });
    }

    const data = await productSchema.findOneAndUpdate(
      { _id: product_id },
      {
        $set: {
          name: name ? name : productData.name,
          description: description ? description : productData.description,
          price: price ? price : productData.price,
          stock_quantity: stock_quantity
            ? stock_quantity
            : productData.stock_quantity,
          category_id: category_id ? category_id : productData.category_id,
          image: fileData ? fileData?.filename : productData.fileData,
        },
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json({ message: "product updated successfully", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    await productSchema.findOneAndDelete({ _id: productId });
    return res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const productDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const data = await productSchema.findOne({ _id: productId });
    if (!data) {
      return res.status(400).json({ message: "product is not exist" });
    }
    const prodcutData = await productSchema.findOneAndDelete({
      _id: productId,
    });
    return res
      .status(200)
      .json({
        message: "product details successfully fetched",
        data: prodcutData,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const categoryList = async (req, res) => {
  try {
    const data = await categorySchema.find().select("name");
    return res.status(200).json({ message: "category data list", data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const productStatus = async (req, res) => {
  try {
    const { _id, status } = req.body;
    const productData = await orderSchmea.findOne({ _id: _id });
    if (!productData) {
      return res.status(400).json({ message: "product is not exist" });
    }

    const data = await orderSchmea.findOneAndUpdate(
      { _id },
      {
        $set: {
          status,
        },
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json({ message: "product status updated successfully", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export default {
  createproduct,
  updateproduct,
  deleteProduct,
  productDetails,
  categoryList,
  productStatus,
};
