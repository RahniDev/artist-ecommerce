import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import 'dotenv/config'
import cookieParser from 'cookie-parser'

import authRoutes from './src/modules/auth/auth.routes'
import userRoutes from './src/modules/user/user.routes'
import categoryRoutes from './src/modules/category/category.routes'
import productRoutes from './src/modules/product/product.routes'
import orderRoutes from './src/modules/order/order.routes'
import braintreeRoutes from './src/modules/braintree/braintree.routes'

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
app.use('/api', braintreeRoutes)


const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})