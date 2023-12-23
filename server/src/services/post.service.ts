import { PrismaClient } from '@prisma/client'
import { getImageUrl } from './s3.service'

const prisma = new PrismaClient()

export type CreatePostParams = {
  title: string
  content: string
  imageName: string
}

export async function createPost(data: CreatePostParams) {
  const newPost = await prisma.post.create({
    data
  })

  return newPost
}

export async function getAllPosts() {
  const posts = await prisma.post.findMany()

  for (const post of posts) {
    post.imageUrl = await getImageUrl(post.imageName)
  }

  return posts
}
