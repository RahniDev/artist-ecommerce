import formidable, { Fields, Files } from 'formidable'
import * as fs from 'fs'
import { Product } from './product.model'
import { errorHandler } from '../../helpers/errorHandler'
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

declare global {
    namespace Express {
        interface Request {
            product?: import('../product/product.model').IProductDocument
        }
    }
}

exports.productById = async (req: Request, res: Response, next: NextFunction, id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' })
    } try {
        const product = await Product.findById(id)
            .populate('category')
            .select("-photo")
        if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        }
        req.product = product
        next()
    } catch (err) { return res.status(400).json({ error: errorHandler(err) }) }
}

exports.read = (req: Request, res: Response): Response => {
    if (!req.product) {
        return res.status(404).json({ error: "Product not loaded" })
    }
    return res.json(req.product)
}


// returns products in same category 
exports.listRelated = async (req: Request, res: Response) => {
    let limit = req.query.limit ? Number(req.query.limit) : 6
    try {
        const products = await Product.find(
            {
                _id: { $ne: req.product?._id },
                category: req.product?.category
            })
            .limit(limit)
            .populate('category', '_id name')
            .lean()
        return res.json(products)
    } catch (err) { return res.status(400).json({ error: 'Products not found' }) }
}

exports.listCategories = async (req: Request, res: Response) => {
    try { const categories = await Product.distinct("category") return res.json(categories) } catch (err) { return res.status(400).json({ error: 'Categories not found' }) }
}

exports.photo = (req: Request, res: Response, next: NextFunction): Response => {
    const photo = req.product?.photo
    if (photo?.data) {
        res.set('Content-Type', photo.contentType)
        return res.send(photo.data)
    }
    next()
}                                             