import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  auth: true,
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      access: {
        create: () => true,
        read: ({ req }) => ({ user: { equals: req.user.id } }),
        update: ({ req }) => ({ user: { equals: req.user.id } }),
        delete: ({ req }) => ({ user: { equals: req.user.id } }),
      },
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'completed', 'cancelled'],
      defaultValue: 'pending',
    },
    {
      name: 'totalPrice',
      type: 'number',
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