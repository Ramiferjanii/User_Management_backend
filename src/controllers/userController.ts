import { Request, Response } from "express";
import User from "../models/User";
import Role from "../models/Role";
import { AuthRequest } from "../middleware/auth";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc", roleId = "" } = req.query;

    const query: any = {};
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    if (roleId) {
      query.roles = roleId;
    }

    const users = await User.find(query)
      .populate("roles")
      .sort({ [sortBy as string]: sortOrder === "asc" ? 1 : -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).populate("roles");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, roles, isActive } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      roles,
      isActive: isActive !== undefined ? isActive : true,
    });

    const populatedUser = await User.findById(user._id).populate("roles");
    res.status(201).json(populatedUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, roles, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (roles) user.roles = roles;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();
    const populatedUser = await User.findById(user._id).populate("roles");
    res.json(populatedUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const assignRoles = async (req: Request, res: Response) => {
  try {
    const { roleIds } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.roles = roleIds;
    await user.save();
    
    const populatedUser = await User.findById(user._id).populate("roles");
    res.json(populatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    const populatedUser = await User.findById(user._id).populate("roles");
    res.json(populatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

