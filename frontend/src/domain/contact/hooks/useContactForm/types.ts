import type { ContactFormData, ContactResponse } from '../../types';

export interface UseContactFormOptions {
  onSuccess?: (data: ContactResponse) => void;
  onError?: (error: Error) => void;
}

export interface UseContactFormReturn {
  submit: (data: ContactFormData) => Promise<ContactResponse>;
  isSubmitting: boolean;
  error: Error | null;
}
