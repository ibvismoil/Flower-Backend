import { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: () => true,
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true;
      return {
        id: { equals: req.user?.id },
      };
    },
    delete: ({ req }) => req.user?.role === 'admin',
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true;
      return {
        id: { equals: req.user?.id },
      };
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' },
      ],
      access: {
        read: ({ req }) => req.user?.role === 'admin',
        create: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'surename', label: 'SureName', type: 'text', required: true },
    { name: 'phoneNumber', label: 'Phone Number', type: 'text', required: true },
    { name: 'country', label: 'Country', type: 'text', required: true },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'street', label: 'Улица / Район', type: 'text', required: true },
    { name: 'house', label: 'Участок или квартира', type: 'text', required: true },
    { name: 'housenumber', label: 'Номер учатска или квартиры', type: 'text', required: true },
  ],
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create' && !req.user) {
          data.role = 'user';
        }
        return data;
      },
    ],
  },
};