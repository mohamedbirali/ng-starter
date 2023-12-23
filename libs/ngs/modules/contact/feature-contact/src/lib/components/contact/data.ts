import { faker } from '@faker-js/faker';
import { TContact } from '../../models/contact.model';

export const MOCK_CONTACTS = () => {
  const sessions = [];
  for (let i = 0; i < 2; i++) {
    const phone = i === 0 ? '+212-712345678' : '+1-012345678';
    const element: TContact = {
      name: `${faker.person.fullName()}`,
      toggle: faker.datatype.boolean(0.5),
      phone: phone,
      contact: phone,
      color: faker.color.rgb(),
      avatar: 'logo/logo-dark.png',
    };
    sessions.push(element);
  }
  return sessions;
};
