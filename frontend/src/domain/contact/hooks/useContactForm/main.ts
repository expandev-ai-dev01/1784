import { useMutation } from '@tanstack/react-query';
import { contactService } from '../../services/contactService';
import type { UseContactFormOptions, UseContactFormReturn } from './types';

export const useContactForm = (options?: UseContactFormOptions): UseContactFormReturn => {
  const {
    mutateAsync: submit,
    isPending: isSubmitting,
    error,
  } = useMutation({
    mutationFn: contactService.submit,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });

  return {
    submit,
    isSubmitting,
    error,
  };
};
