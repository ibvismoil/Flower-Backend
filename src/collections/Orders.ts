import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  auth: true,
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
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
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && req.user) {
          data.user = req.user.id;
        }
        return data;
      },
    ],
  },
  access: {
  read: ({ req }) => {
    if (!req.user) return false;
    return req.user.role === 'admin'
      ? true
      : { user: { equals: req.user.id } };
  },

  update: ({ req }) => {
    if (!req.user) return false;
    return req.user.role === 'admin'
      ? true
      : { user: { equals: req.user.id } };
  },

  delete: ({ req }) => {
    if (!req.user) return false;
    return req.user.role === 'admin'
      ? true
      : { user: { equals: req.user.id } };
  },

  create: ({ req }) => !!req.user,
}

}
