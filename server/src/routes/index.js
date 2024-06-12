import express from "express";
import auth from "../controllers/auth.js";
import validateRegisterReq from "../middlewares/validateRegisterReq.js";

const router = express.Router();

router.post("/api/v1/register", validateRegisterReq, auth.register);

export default router;
