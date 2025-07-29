import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
  },
  access: {
    create: ({ req }) => !!req.user, // Только авторизованные могут создавать
    read: ({ req }) => !!req.user,   // Только свои заказы
    update: ({ req }) => !!req.user, // Только отменять свои
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