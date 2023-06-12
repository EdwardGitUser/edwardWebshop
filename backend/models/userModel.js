import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."], // Name field is required
  },
  email: {
    type: String,
    required: [true, "Email is required."], // Email field is required
    unique: true,
    validate: {
      validator: function (value) {
        // Use a regular expression or other validation method to validate the email format
        // Example regular expression: /^\S+@\S+\.\S+$/
        return /^\S+@\S+\.\S+$/.test(value);
      },
      message: "Invalid email format.",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required."], // Password field is required
    minlength: [6, "Password should be at least 6 characters long."], // Password should be at least 6 characters long
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});


userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

const User = mongoose.model("User", userSchema);

export default User;