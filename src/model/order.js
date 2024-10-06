import { Schema, model } from "mongoose";

const OrderSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "product",
    },
    status: {
      type: Schema.Types.String,
      enum: ["pending", "processing", "shipped", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);
export default model("order", OrderSchema);
