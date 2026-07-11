import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface representing a User document in MongoDB.
 * Extends the Mongoose `Document` interface to gain access to helper methods like `.save()`.
 */
export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  skills: string[];
  role: 'student' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Creates a unique index in MongoDB
      lowercase: true, // Automatically converts value to lowercase
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    skills: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Pre-save hook to prevent duplicate emails (case-insensitive double-check)
UserSchema.pre('save', async function () {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
    
    // Dynamically retrieve/register the model to prevent compilation errors in development
    const User = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
    const existingUser = await User.findOne({ email: this.email });
    
    if (existingUser) {
      throw new Error('Email already exists');
    }
  }
});

// Avoid Re-compilation Error: In Next.js, API routes compile on-demand.
// If we re-run this code, Mongoose will throw a OverwriteModelError.
const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default User;
