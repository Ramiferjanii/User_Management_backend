import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  assignRoles,
  toggleUserStatus,
} from "../controllers/userController";
import { authenticate, authorize } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticate, authorize(["user.read"]), getUsers);
router.get("/:id", authenticate, authorize(["user.read"]), getUser);
router.post("/", authenticate, authorize(["user.create"]), createUser);
router.put("/:id", authenticate, authorize(["user.update"]), updateUser);
router.delete("/:id", authenticate, authorize(["user.delete"]), deleteUser);
router.post("/:id/roles", authenticate, authorize(["user.update"]), assignRoles);
router.patch("/:id/toggle-status", authenticate, authorize(["user.update"]), toggleUserStatus);

export default router;
