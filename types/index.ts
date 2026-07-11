export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  skills: string[];
  role: 'student' | 'admin';
}

export interface Internship {
  id: string;
  postedBy: string; // User id (FK)
  title: string;
  company: string;
  location: string;
  type: 'Remote' | 'Onsite' | 'Hybrid';
  stipend?: number;
  requiredSkills: string[];
  description: string;
  postedAt: string;
}

export interface Application {
  id: string;
  userId: string; // FK -> User
  internshipId: string; // FK -> Internship
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  appliedAt: string;
}
