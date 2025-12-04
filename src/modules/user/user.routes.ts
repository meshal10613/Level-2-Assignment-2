import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.get("/", userController.getAllUsers);
router.put("/:userId", userController.updateUserById);
router.delete("/:userId", userController.deleteUserById);

export const userRoutes = router;