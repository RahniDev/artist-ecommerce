import mongoose from 'mongoose'
import { createHmac } from 'node:crypto'
import { v1 as uuidv1 } from 'uuid'

interface IUser {
    name: string;
    email: string;
    hashed_password: string;
    salt: string;
    role: number;
    history: Array<any>;

}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: 32
    },
    hashed_password: {
        type: String,
        required: true,
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    }
}, { timestamps: true });

// a virtual (not stored in DB)
userSchema.virtual('password')
    .set(function (this: any, password: string) {
        this._password = password
        this.salt = uuidv1()
        // saves the encrypted password
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function (this: any) {
        return this._password
    })

userSchema.methods = {
    authenticate: function (plainText: string) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function (password) {
        if (!password) return '';
        // hashes password
        try {
            return createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    }
}


module.exports = mongoose.model('User', userSchema);