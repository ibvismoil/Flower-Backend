import { CollectionConfig } from 'payload'

export const Favorites: CollectionConfig = {
  slug: 'favorites',
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
  ],
  access: {
    read: ({ req }) => !!req.user, 
    create: ({ req }) => !!req.user, 
    delete: ({ req }) => !!req.user, 
    update: () => false,
  },
}