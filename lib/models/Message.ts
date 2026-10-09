import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";

const MessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "General Inquiry" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type MessageType = InferSchemaType<typeof MessageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Message = models.Message || model("Message", MessageSchema);
