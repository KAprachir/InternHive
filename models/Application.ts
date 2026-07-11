import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface representing an Application document in MongoDB.
 * Links a `User` (student) to an `Internship` with a tracking status.
 */
export interface IApplicationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  internshipId: mongoose.Types.ObjectId;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplicationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the User who is applying
      required: [true, 'User ID is required'],
    },
    internshipId: {
      type: Schema.Types.ObjectId,
      ref: 'Internship', // Reference to the applied Internship
      required: [true, 'Internship ID is required'],
    },
    status: {
      type: String,
      enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
      required: [true, 'Application status is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent a user from applying to the same internship listing multiple times
ApplicationSchema.index({ userId: 1, internshipId: 1 }, { unique: true });

const Application: Model<IApplicationDocument> =
  mongoose.models.Application || mongoose.model<IApplicationDocument>('Application', ApplicationSchema);

export default Application;
