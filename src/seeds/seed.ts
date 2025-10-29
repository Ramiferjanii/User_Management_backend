import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import Role from "../models/Role";
import Permission from "../models/Permission";

dotenv.config();

const seedPermissions = [
  // User permissions
  { name: "user.read", description: "Read users", category: "Users" },
  { name: "user.create", description: "Create users", category: "Users" },
  { name: "user.update", description: "Update users", category: "Users" },
  { name: "user.delete", description: "Delete users", category: "Users" },

  // Role permissions
  { name: "role.read", description: "Read roles", category: "Roles" },
  { name: "role.create", description: "Create roles", category: "Roles" },
  { name: "role.update", description: "Update roles", category: "Roles" },
  { name: "role.delete", description: "Delete roles", category: "Roles" },

  // Permission permissions
  {
    name: "permission.read",
    description: "Read permissions",
    category: "Permissions",
  },

  // Admin permission
  {
    name: "admin",
    description: "Full administrative access",
    category: "System",
  },
];

const seedRoles = [
  {
    name: "Super Admin",
    description: "Full system access",
    isDefault: false,
  },
  {
    name: "User Manager",
    description: "Can manage users",
    isDefault: false,
  },
  {
    name: "Viewer",
    description: "Read-only access",
    isDefault: true,
  },
];

const seedUsers = [
  {
    email: "admin@example.com",
    password: "admin123",
    firstName: "Super",
    lastName: "Admin",
    isActive: true,
  },
  {
    email: "manager@example.com",
    password: "manager123",
    firstName: "User",
    lastName: "Manager",
    isActive: true,
  },
  {
    email: "viewer@example.com",
    password: "viewer123",
    firstName: "Read",
    lastName: "Only",
    isActive: true,
  },
  {
    email: "user1@example.com",
    password: "user1123",
    firstName: "John",
    lastName: "Doe",
    isActive: true,
  },
  {
    email: "user2@example.com",
    password: "user2123",
    firstName: "Jane",
    lastName: "Smith",
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});

    console.log("Cleared existing data");

    // Create permissions
    const createdPermissions = await Permission.insertMany(seedPermissions);
    console.log("Created permissions");

    // Create roles with permissions
    const permissionMap = createdPermissions.reduce((map, perm) => {
      map[perm.name] = perm._id;
      return map;
    }, {} as any);

    const superAdminRole = await Role.create({
      ...seedRoles[0],
      permissions: createdPermissions.map((p) => p._id),
    });

    const userManagerRole = await Role.create({
      ...seedRoles[1],
      permissions: [
        permissionMap["user.read"],
        permissionMap["user.create"],
        permissionMap["user.update"],
        permissionMap["user.delete"],
      ],
    });

    const viewerRole = await Role.create({
      ...seedRoles[2],
      permissions: [
        permissionMap["user.read"],
        permissionMap["role.read"],
        permissionMap["permission.read"],
      ],
    });

    console.log("Created roles");

    // Create users with roles
    await User.create({
      ...seedUsers[0],
      roles: [superAdminRole._id],
    });

    await User.create({
      ...seedUsers[1],
      roles: [userManagerRole._id],
    });

    await User.create({
      ...seedUsers[2],
      roles: [viewerRole._id],
    });

    await User.create({
      ...seedUsers[3],
      roles: [viewerRole._id],
    });

    await User.create({
      ...seedUsers[4],
      roles: [viewerRole._id],
    });

    console.log("Created users");
    console.log("Seed completed successfully!");
    console.log("\nTest credentials:");
    console.log("Super Admin: admin@example.com / admin123");
    console.log("User Manager: manager@example.com / manager123");
    console.log("Viewer: viewer@example.com / viewer123");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();
