import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface representing an Internship document in MongoDB.
 * The `postedBy` field holds a reference to a `User` document's ObjectId.
 */
export interface IInternshipDocument extends Document {
  postedBy: mongoose.Types.ObjectId;
  title: string;
  company: string;
  location: string;
  type: 'Remote' | 'Onsite' | 'Hybrid';
  stipend?: number;
  requiredSkills: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipSchema = new Schema<IInternshipDocument>(
  {
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Establishes relation with the User model
      required: [true, 'Author/postedBy is required'],
    },
    title: {
      type: String,
      required: [true, 'Internship title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Remote', 'Onsite', 'Hybrid'],
      required: [true, 'Type is required (Remote, Onsite, or Hybrid)'],
    },
    stipend: {
      type: Number,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Internship: Model<IInternshipDocument> =
  mongoose.models.Internship || mongoose.model<IInternshipDocument>('Internship', InternshipSchema);

export default Internship;
