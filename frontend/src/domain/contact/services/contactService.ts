import { publicClient } from '@/core/lib/api';
import type { ContactFormData, ContactResponse } from '../types';

export const contactService = {
  async submit(data: ContactFormData): Promise<ContactResponse> {
    const response = await publicClient.post('/contact', data);
    return response.data.data;
  },
};
