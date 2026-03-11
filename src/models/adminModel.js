const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
});

const Admin = mongoose.model("Admin", adminSchema);

const findAdminByEmail = async (email) => {
  return await Admin.findOne({ email });
};

const createAdmin = async (data) => {
  return await Admin.create(data);
};

module.exports = {
  Admin,
  findAdminByEmail,
  createAdmin,
};
