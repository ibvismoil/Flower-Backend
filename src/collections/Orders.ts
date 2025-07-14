import { CollectionConfig } from 'payload';

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
  },
  access: {
    create: ({ req }) => !!req.user,
    read: ({ req }) => {
  if (req.user?.role === 'admin') return true;
  if (!req.user) return false; // 🛡 защита
  return {
    user: { equals: req.user.id },
  };
},

    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req, id }) => {
      if (req.user?.role === 'admin') return true;
       if (!req.user) return false; 
      return {
        and: [
          { id: { equals: id } },
          { user: { equals: req.user.id } },
        ],
      };
    },
  },
  fields: [
    {
      name: 'user',
      label: 'Пользователь',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'items',
      label: 'Товары в заказе',
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
        },
      ],
    },
    {
      name: 'status',
      label: 'Статус заказа',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'В ожидании', value: 'pending' },
        { label: 'Обрабатывается', value: 'processing' },
        { label: 'Завершён', value: 'completed' },
        { label: 'Отменён', value: 'cancelled' },
      ],
    },
  ],
};