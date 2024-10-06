import { Schema, model } from "mongoose";

// Define the schema
const RoleSchema = new Schema(
  {
    role: {
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
export default model("role", RoleSchema);
