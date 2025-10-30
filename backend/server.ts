import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import {query} from 'express-validator'

import authRoutes from './modules/auth/auth.routes'
import userRoutes from './modules/user/user.routes'
import categoryRoutes from './modules/category/category.routes'
import productRoutes from './modules/product/product.routes'
import orderRoutes from './modules/order/order.routes'

const app = express()

app.use(morgan('dev'))

app.use(cookieParser())
app.use(express.json())
app.use(cors())


app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)
app.use('/api', orderRoutes)


 const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})