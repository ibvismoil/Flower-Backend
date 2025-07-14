import { CollectionConfig } from 'payload'

export const Banners: CollectionConfig = {
  slug: 'banners',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'image',
      label: 'Main Image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
