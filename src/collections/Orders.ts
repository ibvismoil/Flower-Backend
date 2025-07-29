import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
  },
  access: {
    create: ({ req }) => !!req.user,
    read: ({ req }) => !!req.user,   
    update: ({ req }) => !!req.user, 
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'products',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'В обработке', value: 'pending' },
        { label: 'Отменён', value: 'cancelled' },
        { label: 'Завершён', value: 'completed' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: { readOnly: true },
      defaultValue: () => new Date(),
    },
  ],
}