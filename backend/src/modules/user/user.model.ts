import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    hashed_password: string;
    salt: string;
    role: number;
    history: unknown[];

    // virtual property for TypeScript
    password?: string;

    // methods are synchronous
    authenticate(password: string): boolean;
    encryptPassword(password: string): string;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true, // fixed
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
    },
    { timestamps: true }
);

UserSchema.virtual("password")
    .set(function (this: IUser, password: string) {
        this.salt = bcrypt.genSaltSync(12);
        this.hashed_password = bcrypt.hashSync(password, this.salt);
    })
    .get(function (this: IUser) {
        return undefined;
    });

UserSchema.methods.authenticate = async function (this: IUser, plainText: string) {
    return bcrypt.compare(plainText, this.hashed_password);
};

UserSchema.methods.encryptPassword = async function (this: IUser, password: string) {
    if (!password) return "";
    return bcrypt.hash(password, this.salt);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
