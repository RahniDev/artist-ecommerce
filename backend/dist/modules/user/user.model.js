import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    hashed_password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    },
    role: {
        type: Number,
        default: 0,
    },
    history: {
        type: [Schema.Types.Mixed],
        default: [],
    },
}, { timestamps: true });
UserSchema.virtual("password")
    .set(function (password) {
    this.salt = bcrypt.genSaltSync(12);
    this.hashed_password = bcrypt.hashSync(password, this.salt);
})
    .get(function () {
    return undefined;
});
UserSchema.methods.authenticate = async function (plainText) {
    return bcrypt.compare(plainText, this.hashed_password);
};
UserSchema.methods.encryptPassword = async function (password) {
    if (!password)
        return "";
    return bcrypt.hash(password, this.salt);
};
export const User = mongoose.model("User", UserSchema);
