import { Request, Response } from "express";
import Role from "../models/Role";

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find().populate("permissions");
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getRole = async (req: Request, res: Response) => {
  try {
    const role = await Role.findById(req.params.id).populate("permissions");
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description, permissions, isDefault } = req.body;

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = await Role.create({
      name,
      description,
      permissions,
      isDefault: isDefault || false,
    });

    const populatedRole = await Role.findById(role._id).populate("permissions");
    res.status(201).json(populatedRole);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { name, description, permissions, isDefault } = req.body;

    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (name) role.name = name;
    if (description) role.description = description;
    if (permissions) role.permissions = permissions;
    if (isDefault !== undefined) role.isDefault = isDefault;

    await role.save();
    const populatedRole = await Role.findById(role._id).populate("permissions");
    res.json(populatedRole);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    await role.deleteOne();
    res.json({ message: "Role deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const assignPermissions = async (req: Request, res: Response) => {
  try {
    const { permissionIds } = req.body;
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    role.permissions = permissionIds;
    await role.save();
    
    const populatedRole = await Role.findById(role._id).populate("permissions");
    res.json(populatedRole);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

