import { Router } from "express";
import { UserController } from "../controllers/UserControllers";

export const router = Router();

router.get("/", new UserController().getProfile);
router.post("/register", new UserController().create);
router.post("/login", new  UserController().login);
