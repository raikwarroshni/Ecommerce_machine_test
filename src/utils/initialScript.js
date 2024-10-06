import RoleModel from "../model/role.js";
import UserModel from "../model/user.js";
import CategoryModel from "../model/category.js";
import bcrypt from "bcrypt";

// Default role data
const defaultRoles = [{ role: "Admin" }, { role: "User" }];

// Function to create default roles
async function createDefaultRole() {
  try {
    const count = await RoleModel.countDocuments();
    if (count === 0) {
      await RoleModel.insertMany(defaultRoles);
      console.log("default role added successfully");
    }
  } catch (error) {
    console.error("Error creating default roles:", error);
  }
}

// Function to create default users
async function createDefaultUser() {
  try {
    const adminRoleData = await RoleModel.findOne({ role: "Admin" });
    const userRoleData = await RoleModel.findOne({ role: "User" });

    if (!adminRoleData || !userRoleData) {
      console.error("One or more roles not found");
      return;
    }

    const hashedPassword = await bcrypt.hash("password123", 10);
    const defaultUsers = [
      {
        email: "john.doe@example.com",
        password: hashedPassword,
        role_id: adminRoleData._id,
        status: 1,
        name: "John Doe",
      },
      {
        email: "david.doe@example.com",
        password: hashedPassword,
        role_id: userRoleData._id,
        status: 1,
        name: "David Doe",
      },
    ];

    // Check for existing admin users
    const existingAdmins = await UserModel.find({ role_id: adminRoleData._id });
    if (existingAdmins.length === 0) {
      await UserModel.insertMany(defaultUsers);
      console.log("default user added successfully"); // Correct model usage here
    }
  } catch (error) {
    console.error("Error creating default users:", error);
  }
}

// Default category data
const defaultCategory = [{ name: "electric" }, { name: "beauty" }];

// Function to create default roles
async function createdefaultCategory() {
  try {
    const count = await CategoryModel.countDocuments();
    if (count === 0) {
      await CategoryModel.insertMany(defaultCategory);
      console.log("default category added successfully");
    }
  } catch (error) {
    console.error("Error creating default roles:", error);
  }
}

// Main function to run the seeders
async function runInitialDBScript() {
  try {
    // Run the seeding functions
    await createDefaultRole();
    await createDefaultUser();
    await createdefaultCategory();
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

// Export the main function for external use
export default runInitialDBScript;
