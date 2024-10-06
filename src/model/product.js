import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
    },
    description: {
      type: Schema.Types.String,
    },
    price: {
      type: Schema.Types.String,
    },
    image: {
      type: Schema.Types.String,
    },
    stock_quantity: {
      type: Schema.Types.Number,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
  },
  { timestamps: true }
);
export default model("product", ProductSchema);
