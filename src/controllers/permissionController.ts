import { Request, Response } from "express";
import Permission from "../models/Permission";

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await Permission.find().sort({ category: 1, name: 1 });
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getPermission = async (req: Request, res: Response) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    res.json(permission);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createPermission = async (req: Request, res: Response) => {
  try {
    const { name, description, category } = req.body;

    const existingPermission = await Permission.findOne({ name });
    if (existingPermission) {
      return res.status(400).json({ message: "Permission already exists" });
    }

    const permission = await Permission.create({
      name,
      description,
      category,
    });

    res.status(201).json(permission);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  try {
    const { name, description, category } = req.body;

    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    if (name) permission.name = name;
    if (description) permission.description = description;
    if (category) permission.category = category;

    await permission.save();
    res.json(permission);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    await permission.deleteOne();
    res.json({ message: "Permission deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

