import User from "./user";

export default interface SignUpResponse {
  user: User;
  token: string;
}
