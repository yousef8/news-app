interface User {
  _id: string;
  name: string;
  email: string;
  sourceIds: string[];
  loginAttempts: { ip: string; success: boolean; timestamp: string }[];
  createdAt: string;
  updatedAt: string;
}

export { User };
