import express from "express";
import auth from "../controllers/auth.js";
import validateRegisterReq from "../middlewares/validateRegisterReq.js";
import authenticate from "../middlewares/authenticate.js";
import validateLoginReq from "../middlewares/validateLoginReq.js";
import sources from "../controllers/sources.js";
import validateSubscribeReq from "../middlewares/validateSubscribeReq.js";
import news from "../controllers/news.js";

const router = express.Router();

router.post("/api/v1/register", validateRegisterReq, auth.register);
router.post("/api/v1/login", validateLoginReq, auth.login);
router.post("/api/v1/logout", authenticate, auth.logout);
router.get("/api/v1/me", authenticate, auth.me);
router.get("/api/v1/login-history", authenticate, auth.loginAttempts);

router.get("/api/v1/sources", sources.getSources);
router.get("/api/v1/sources/categories", sources.getCategories);
router.get("/api/v1/sources/countries", sources.getCountries);
router.get("/api/v1/sources/languages", sources.getLanguages);

router.post(
  "/api/v1/subscribe",
  authenticate,
  validateSubscribeReq,
  sources.subscribe,
);
router.post(
  "/api/v1/unsubscribe",
  authenticate,
  validateSubscribeReq,
  sources.unSubscribe,
);
router.get("/api/v1/top-sources", sources.topSubscribedSources);

router.get("/api/v1/subscription-news", authenticate, news.subscriptionNews);

router.get("/api/v1/health", authenticate, (req, res) => {
  res.status(400).json({ message: "OK" });
});

export default router;
