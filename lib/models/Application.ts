import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";

const ApplicationSchema = new Schema(
  {
    // Course selection
    course: { type: String, required: true },
    campus: { type: String, default: "" },

    // Personal information
    fullName: { type: String, required: true },
    idNumber: { type: String, default: "" }, // SA ID or passport number
    dateOfBirth: { type: String, default: "" },
    gender: { type: String, default: "" },
    nationality: { type: String, default: "" },
    homeLanguage: { type: String, default: "" },

    // Contact details
    phone: { type: String, required: true }, // cell phone
    email: { type: String, default: "" },
    residentialAddress: { type: String, default: "" },
    postalAddress: { type: String, default: "" },

    // Parent / guardian details
    guardianName: { type: String, default: "" },
    guardianRelationship: { type: String, default: "" },
    guardianPhone: { type: String, default: "" },
    guardianEmail: { type: String, default: "" },
    guardianOccupation: { type: String, default: "" },

    // Academic information
    school: { type: String, default: "" }, // high school or college
    highestQualification: { type: String, default: "" },
    yearCompleted: { type: String, default: "" },

    // Supporting documents (uploaded file URLs)
    docId: { type: String, default: "" }, // certified copy of ID / passport
    docResults: { type: String, default: "" }, // latest academic result / certificate
    docResidence: { type: String, default: "" }, // proof of residence
    docFee: { type: String, default: "" }, // proof of registration fee payment

    status: {
      type: String,
      enum: ["Pending", "Contacted", "Registered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export type ApplicationType = InferSchemaType<typeof ApplicationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Application =
  models.Application || model("Application", ApplicationSchema);
