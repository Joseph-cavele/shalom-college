import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";

export const APPLICATION_STATUSES = ["Pending", "Contacted", "Registered", "Rejected"];
export const STUDY_MODES = ["Full-time", "Part-time"];

const ApplicationSchema = new Schema(
  {
    // Short reference the applicant receives, e.g. "SHA-7K3Q9P" (searchable in the dashboard).
    reference: { type: String, default: "", index: true },
    // When the applicant agreed to the POPIA notice on the form.
    consentAt: { type: Date },

    // Course selection
    course: { type: String, required: true },
    campus: { type: String, default: "" },
    studyMode: { type: String, enum: ["", ...STUDY_MODES], default: "" }, // Full-time / Part-time

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
      enum: APPLICATION_STATUSES,
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
