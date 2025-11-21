import mongoose, { Schema, Types } from 'mongoose'

export interface IProduct {
    name: string;
    description: string;
    price: number;
    category: Types.ObjectId;
    quantity: number;
    sold: number;
    photo: string;
    shipping: boolean;
}

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    quantity: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    shipping: {
        required: false,
        type: Boolean
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);