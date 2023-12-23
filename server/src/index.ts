import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import errorHandlingMiddleware from './middlewares/error-handling.middleware'
import ApiError from './helpers/api-error'
import { upLoadImage } from './services/s3.service'
import { StatusCodes } from 'http-status-codes'
import multerMiddleware from './middlewares/multer.middleware'
import { createPost, getAllPosts } from './services/post.service'

const app = express()
const prisma = new PrismaClient()

app.use(express.json())
app.use(cors())

app.post('/api/posts', multerMiddleware, async (req, res, next) => {
  try {
    const { title, content } = req.body

    if (!title || !content) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing title or/and content')
    }

    if (!req.file) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing image')
    }

    const imageName = await upLoadImage(req.file)

    const newPost = await createPost({ title, content, imageName })

    res.status(200).json({ post: newPost })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

app.get('/api/posts', async (req, res, next) => {
  try {
    const posts = await getAllPosts()
    res.status(200).json({ posts })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

app.use(errorHandlingMiddleware)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listing on Port ${PORT}`))
