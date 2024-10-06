import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
    },
    email: {
      type: Schema.Types.String,
    },
    password: {
      type: Schema.Types.String,
    },
    role_id: {
      type: Schema.Types.ObjectId,
      ref: "role",
    },
  },
  { timestamps: true }
);
export default model("user", UserSchema);
