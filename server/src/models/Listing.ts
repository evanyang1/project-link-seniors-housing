import mongoose, { Document, Schema } from "mongoose";

export interface IListing extends Document {
  owner: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: "room" | "apartment" | "house";
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  amenities: string[];
  rules: string[];
  images: string[];
  availability: {
    startDate: Date;
    endDate?: Date;
    isAvailable: boolean;
  };
  requirements: {
    minAge: number;
    maxAge: number;
    gender: "male" | "female" | "other" | "no-preference";
    smoking: boolean;
    pets: boolean;
    employmentStatus: "employed" | "student" | "any";
    incomeRequired: boolean;
    minIncome?: number;
  };
  status: "active" | "pending" | "rented" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema<IListing>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    type: {
      type: String,
      enum: ["room", "apartment", "house"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    amenities: [
      {
        type: String,
      },
    ],
    rules: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    availability: {
      startDate: { type: Date, required: true },
      endDate: Date,
      isAvailable: { type: Boolean, default: true },
    },
    requirements: {
      minAge: { type: Number, required: true, min: 18 },
      maxAge: { type: Number, required: true },
      gender: {
        type: String,
        enum: ["male", "female", "other", "no-preference"],
        default: "no-preference",
      },
      smoking: { type: Boolean, default: false },
      pets: { type: Boolean, default: false },
      employmentStatus: {
        type: String,
        enum: ["employed", "student", "any"],
        default: "any",
      },
      incomeRequired: { type: Boolean, default: false },
      minIncome: Number,
    },
    status: {
      type: String,
      enum: ["active", "pending", "rented", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
listingSchema.index({
  "location.city": "text",
  "location.state": "text",
  title: "text",
  description: "text",
});

export const Listing = mongoose.model<IListing>("Listing", listingSchema);
