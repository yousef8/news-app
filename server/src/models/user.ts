import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    sourceIds: [
      {
        type: String,
      },
    ],
    loginAttempts: {
      type: [
        {
          ip: {
            type: String,
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
          success: {
            type: Boolean,
            required: true,
          },
        },
      ],

      _id: false,
      default: [],
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform: (doc, ret) => {
        const customRet = ret;
        delete customRet.__v;
        delete customRet.password;
        return customRet;
      },
    },
  }
);

userSchema.pre("save", async function preSaveHook() {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.verifyPassword = async function verifyPassword(password) {
  const valid = await bcrypt.compare(password.toString(), this.password);
  return valid;
};

const User = mongoose.model("User", userSchema);

export default User;
