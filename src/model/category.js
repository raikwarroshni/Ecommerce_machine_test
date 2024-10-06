import { Schema, model } from "mongoose";

// Define the schema
const CategorySchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create the model
export default model("category", CategorySchema);
