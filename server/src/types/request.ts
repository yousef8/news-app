import type { Request } from "express";
import { User } from "./user.js";

interface AuthenticatedRequest extends Request {
  user: User;
}

interface ValidatedRequest extends Request {
  validReq: Record<string, any>; 
}

export { AuthenticatedRequest, ValidatedRequest };
