import User from "./user";

export default interface LoginResponse {
  user: User;
  token: string;
}
