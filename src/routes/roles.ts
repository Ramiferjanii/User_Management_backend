import express from "express";
import {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  assignPermissions,
} from "../controllers/roleController";
import { authenticate, authorize } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticate, authorize(["role.read"]), getRoles);
router.get("/:id", authenticate, authorize(["role.read"]), getRole);
router.post("/", authenticate, authorize(["role.create"]), createRole);
router.put("/:id", authenticate, authorize(["role.update"]), updateRole);
router.delete("/:id", authenticate, authorize(["role.delete"]), deleteRole);
router.post("/:id/permissions", authenticate, authorize(["role.update"]), assignPermissions);

export default router;

