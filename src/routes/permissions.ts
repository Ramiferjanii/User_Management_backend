import express from "express";
import {
  getPermissions,
  getPermission,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permissionController";
import { authenticate, authorize } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticate, authorize(["permission.read"]), getPermissions);
router.get("/:id", authenticate, authorize(["permission.read"]), getPermission);
router.post("/", authenticate, authorize(["permission.create"]), createPermission);
router.put("/:id", authenticate, authorize(["permission.update"]), updatePermission);
router.delete("/:id", authenticate, authorize(["permission.delete"]), deletePermission);

export default router;

