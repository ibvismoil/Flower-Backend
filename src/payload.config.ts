import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'
import { buildConfig, FileData } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Category } from './collections/Category'
import { Banners } from './collections/Banner'
import { Favorites } from './collections/Favorites'
import { Orders } from './collections/Orders'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const cloudinaryAdapter = () => ({
  name: 'cloudinary-adapter',
  async handleUpload({
    file,
    collection,
    data,
  }: {
    file: FileData
    collection: string
    data: Record<string, unknown>
  }) {
    const filenameWithoutExt = file.filename.replace(/\.[^/.]+$/, '')
    const folderPath = 'flower_shop'

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: `${folderPath}/${filenameWithoutExt}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      )

      const fileWithBuffer = file as FileData & { buffer: Buffer }

      if (!fileWithBuffer.buffer) {
        return reject(new Error('File buffer is missing'))
      }

      stream.end(fileWithBuffer.buffer)
    })

    return {
      ...data,
      url: uploadResult.secure_url,
    }
  },

  async handleDelete({ filename }: { filename: string }) {
    const filenameWithoutExt = filename.replace(/\.[^/.]+$/, '')
    await cloudinary.uploader.destroy(`flower_shop/${filenameWithoutExt}`)
  },
})

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [ Users, Media, Products, Category, Banners, Favorites, Orders],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  cors: '*',
  sharp,
  plugins: [
    cloudStoragePlugin({
      collections: {
        [Media.slug]: {
          adapter: cloudinaryAdapter,
          disableLocalStorage: true,
          generateFileURL: ({ filename }: { filename: string | number }) => {
            const name = filename.toString()
            const filenameWithoutExt = name.replace(/\.[^/.]+$/, '')
            return cloudinary.url(`flower_shop/${filenameWithoutExt}`, {
              secure: true,
              resource_type: 'image',
            })
          },
        },
      },
    }),
  ],
})