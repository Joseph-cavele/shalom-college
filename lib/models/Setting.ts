import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";

// Single-document collection holding site settings + editable homepage content.
const BannerSchema = new Schema(
  { title: { type: String, required: true }, active: { type: Boolean, default: true } },
  { _id: false }
);

const SettingSchema = new Schema(
  {
    key: { type: String, default: "site", unique: true },
    // Contact / identity
    schoolName: { type: String, default: "Shalom Training School" },
    regNo: { type: String, default: "2025/943395/07" },
    tagline: { type: String, default: "Created for the people" },
    email: { type: String, default: "info@shalomtraingcollege.co.za" },
    phone1: { type: String, default: "063 561 8241" },
    phone2: { type: String, default: "079 296 6008" },
    phone3: { type: String, default: "072 097 1972" },
    whatsapp: { type: String, default: "063 561 8241" },
    campus1: { type: String, default: "27 Steen Street, Rustenburg, North West 0300" },
    campus2: { type: String, default: "40 Kapp Building, Murray Avenue, 1st Floor, Brits 0250" },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    accreditation: { type: String, default: "MERSETA Accredited" },
    established: { type: String, default: "2025" },
    mission: { type: String, default: "To empower individuals with relevant skills and knowledge through quality training and development." },
    vision: { type: String, default: "To be a leading training provider that contributes to the growth and development of the communities." },
    // Homepage content
    heroTitle: { type: String, default: "START YOUR CAREER TODAY!" },
    heroSubtitle: { type: String, default: "Quality Practical Training for a Better Tomorrow" },
    heroText: { type: String, default: "We offer accredited practical and theoretical training to help you build the skills you need for a successful future." },
    whyChoose: {
      type: [String],
      default: [
        "MERSETA Accredited",
        "Qualified & Experienced Instructors",
        "Modern Equipment & Facilities",
        "Practical & Theoretical Training",
      ],
    },
    banners: { type: [BannerSchema], default: [] },
  },
  { timestamps: true }
);

export type SettingType = InferSchemaType<typeof SettingSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Setting = models.Setting || model("Setting", SettingSchema);
