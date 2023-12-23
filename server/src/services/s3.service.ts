import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import 'dotenv/config.js'
import { bucketName, s3 } from '~/providers/aws-s3'
import randomImageName from '~/helpers/random-image-name'
import sharp from 'sharp'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const upLoadImage = async (file: Express.Multer.File): Promise<string> => {
  const buffer = await sharp(file.buffer).resize({ height: 1920, width: 1080, fit: 'contain' }).toBuffer()
  const imageName = randomImageName()

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Body: buffer,
    ContentType: file.mimetype
  }

  const command = new PutObjectCommand(params)

  await s3.send(command)

  return imageName
}

export const getImageUrl = async (imageName: string): Promise<string> => {
  const params = {
    Bucket: bucketName,
    Key: imageName
  }

  const command = new GetObjectCommand(params)
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 })

  return url
}

export const deleteImage = async (imageName: string): Promise<void> => {
  const params = {
    Bucket: bucketName,
    Key: imageName
  }

  const command = new DeleteObjectCommand(params)
  await s3.send(command)
}
