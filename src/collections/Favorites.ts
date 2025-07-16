import { CollectionConfig } from 'payload'

export const Favorites: CollectionConfig = {
  slug: 'favorites',
  auth: true,
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id, // автоматически связывает с текущим пользователем
      access: {
        create: () => true,
        read: ({ req }) => ({ user: { equals: req.user.id } }),
        update: ({ req }) => ({ user: { equals: req.user.id } }),
        delete: ({ req }) => ({ user: { equals: req.user.id } }),
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
  ],
  access: {
    read: ({ req }) => ({ user: { equals: req.user.id } }),
    update: ({ req }) => ({ user: { equals: req.user.id } }),
    delete: ({ req }) => ({ user: { equals: req.user.id } }),
    create: () => true,
  },
}