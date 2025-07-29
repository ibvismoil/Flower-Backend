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
    read: ({ req }) => !!req.user, // Только авторизованные пользователи могут читать
    create: ({ req }) => !!req.user, // Только авторизованные могут добавлять
    delete: ({ req }) => !!req.user, // Только авторизованные могут удалять
    update: () => false, // Обновлять не нужно
  },
}