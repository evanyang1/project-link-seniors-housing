import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "senior" | "roommate";
  dateOfBirth: Date;
  phoneNumber: string;
  profilePicture?: string;
  bio?: string;
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
  preferences: {
    smoking: boolean;
    pets: boolean;
    gender: "male" | "female" | "other" | "no-preference";
    ageRange: {
      min: number;
      max: number;
    };
    maxRent: number;
    moveInDate?: Date;
  };
  verificationStatus: {
    emailVerified: boolean;
    phoneVerified: boolean;
    identityVerified: boolean;
    backgroundChecked: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["senior", "roommate"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 1000,
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
    preferences: {
      smoking: { type: Boolean, default: false },
      pets: { type: Boolean, default: false },
      gender: {
        type: String,
        enum: ["male", "female", "other", "no-preference"],
        default: "no-preference",
      },
      ageRange: {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
      },
      maxRent: { type: Number, required: true },
      moveInDate: Date,
    },
    verificationStatus: {
      emailVerified: { type: Boolean, default: false },
      phoneVerified: { type: Boolean, default: false },
      identityVerified: { type: Boolean, default: false },
      backgroundChecked: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
