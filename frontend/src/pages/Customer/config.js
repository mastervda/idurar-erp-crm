export const fields = {
  name: {
    type: 'string',
    required: true,
    label: 'Name',
  },
  shortName: {
    type: 'string',
    required: false,
    label: 'Short Name',
  },
  phone: {
    type: 'phone',
    label: 'Phone',
  },
  country: {
    type: 'country',
    label: 'Country',
  },
  address: {
    type: 'string',
    label: 'Address',
  },
  email: {
    type: 'email',
    label: 'Email',
  },
};
