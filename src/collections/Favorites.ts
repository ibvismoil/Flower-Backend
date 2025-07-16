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
      defaultValue: ({ user }) => user?.id,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
  ],
  access: {
  read: ({ req }) =>
    req.user?.role === 'admin'
      ? true
      : { user: { equals: req.user?.id } },

  update: ({ req }) =>
    req.user?.role === 'admin'
      ? true
      : { user: { equals: req.user?.id } },

  delete: ({ req }) =>
    req.user?.role === 'admin'
      ? true
      : { user: { equals: req.user?.id } },

  create: ({ req }) => !!req.user,
},

}
