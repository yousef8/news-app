import LoginAttempt from "./loginAttempt";

export default interface User {
  _id: string;
  name: string;
  email: string;
  sourceIds: string[];
  loginAttempts: LoginAttempt[];
}
