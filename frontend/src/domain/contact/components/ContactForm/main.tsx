import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { Button } from '@/core/components/Button';
import { Input } from '@/core/components/Input';
import { contactFormSchema, type ContactFormData } from '../../validations/contactForm';
import { useContactForm } from '../../hooks/useContactForm';
import type { ContactFormProps } from './types';
import { cn } from '@/core/utils/cn';

export const ContactForm = ({ vehicle, onSuccess }: ContactFormProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [protocolo, setProtocolo] = useState('');
  const [charCount, setCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
    defaultValues: {
      nomeCompleto: '',
      email: '',
      telefone: '',
      preferenciaContato: 'E-mail',
      melhorHorario: 'Qualquer horário',
      idVeiculo: parseInt(vehicle.id),
      modeloVeiculo: `${vehicle.marca} ${vehicle.modelo} (${vehicle.ano})`,
      assunto: 'Informações gerais',
      mensagem: '',
      financiamento: false,
      termosPrivacidade: false,
      receberNovidades: false,
    },
  });

  const { submit, isSubmitting } = useContactForm({
    onSuccess: (data) => {
      setProtocolo(data.protocolo);
      setShowSuccess(true);
      reset();
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Error submitting contact form:', error);
    },
  });

  const assunto = watch('assunto');
  const mensagem = watch('mensagem');

  useEffect(() => {
    if (assunto === 'Financiamento') {
      setValue('financiamento', true);
    }
  }, [assunto, setValue]);

  useEffect(() => {
    setCharCount(mensagem?.length || 0);
  }, [mensagem]);

  const onSubmit = async (data: ContactFormData) => {
    const sanitizedData = {
      ...data,
      mensagem: DOMPurify.sanitize(data.mensagem),
    };

    await submit(sanitizedData);
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue('telefone', formatted, { shouldValidate: true });
  };

  if (showSuccess) {
    return (
      <div className="p-6 border border-border rounded-sm bg-green-50 stack gap-4">
        <div className="center gap-3">
          <div className="size-12 rounded-full bg-green-600 center text-white text-2xl">✓</div>
          <h3 className="text-xl font-semibold text-green-800">Mensagem enviada com sucesso!</h3>
        </div>
        <div className="stack gap-2 text-center">
          <p className="text-sm text-green-700">
            Seu protocolo de atendimento é: <strong>{protocolo}</strong>
          </p>
          <p className="text-sm text-green-700">
            Entraremos em contato em até <strong>24 horas úteis</strong>.
          </p>
          <p className="text-sm text-green-700">
            Um e-mail de confirmação foi enviado para o endereço informado.
          </p>
        </div>
        <Button onClick={() => setShowSuccess(false)} variant="outline" className="w-full">
          Enviar nova mensagem
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="stack gap-6">
      <div className="stack gap-4">
        <h3 className="text-xl font-semibold">Dados Pessoais</h3>

        <div className="stack gap-2">
          <label htmlFor="nomeCompleto" className="text-sm font-medium">
            Nome Completo <span className="text-red-600">*</span>
          </label>
          <Input
            id="nomeCompleto"
            {...register('nomeCompleto')}
            placeholder="Digite seu nome completo"
            aria-invalid={!!errors.nomeCompleto}
            aria-describedby={errors.nomeCompleto ? 'nomeCompleto-error' : undefined}
          />
          {errors.nomeCompleto && (
            <span id="nomeCompleto-error" role="alert" className="text-sm text-red-600">
              {errors.nomeCompleto.message}
            </span>
          )}
        </div>

        <div className="stack gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail <span className="text-red-600">*</span>
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="seu@email.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span id="email-error" role="alert" className="text-sm text-red-600">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="stack gap-2">
          <label htmlFor="telefone" className="text-sm font-medium">
            Telefone <span className="text-red-600">*</span>
          </label>
          <Input
            id="telefone"
            type="tel"
            {...register('telefone')}
            onChange={handlePhoneChange}
            placeholder="(00) 00000-0000"
            maxLength={15}
            aria-invalid={!!errors.telefone}
            aria-describedby={errors.telefone ? 'telefone-error' : undefined}
          />
          {errors.telefone && (
            <span id="telefone-error" role="alert" className="text-sm text-red-600">
              {errors.telefone.message}
            </span>
          )}
        </div>

        <div className="stack gap-2">
          <label htmlFor="preferenciaContato" className="text-sm font-medium">
            Preferência de Contato <span className="text-red-600">*</span>
          </label>
          <select
            id="preferenciaContato"
            {...register('preferenciaContato')}
            className="h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
            aria-invalid={!!errors.preferenciaContato}
            aria-describedby={errors.preferenciaContato ? 'preferenciaContato-error' : undefined}
          >
            <option value="Telefone">Telefone</option>
            <option value="E-mail">E-mail</option>
            <option value="WhatsApp">WhatsApp</option>
          </select>
          {errors.preferenciaContato && (
            <span id="preferenciaContato-error" role="alert" className="text-sm text-red-600">
              {errors.preferenciaContato.message}
            </span>
          )}
        </div>

        <div className="stack gap-2">
          <label htmlFor="melhorHorario" className="text-sm font-medium">
            Melhor Horário para Contato
          </label>
          <select
            id="melhorHorario"
            {...register('melhorHorario')}
            className="h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Manhã">Manhã</option>
            <option value="Tarde">Tarde</option>
            <option value="Noite">Noite</option>
            <option value="Qualquer horário">Qualquer horário</option>
          </select>
        </div>
      </div>

      <div className="stack gap-4">
        <h3 className="text-xl font-semibold">Informações sobre o Veículo</h3>

        <div className="p-4 bg-muted/50 rounded-sm stack gap-2">
          <p className="text-sm font-medium">Veículo de Interesse:</p>
          <p className="text-base font-semibold text-primary-600">
            {vehicle.marca} {vehicle.modelo} ({vehicle.ano})
          </p>
        </div>

        <div className="stack gap-2">
          <label htmlFor="assunto" className="text-sm font-medium">
            Assunto <span className="text-red-600">*</span>
          </label>
          <select
            id="assunto"
            {...register('assunto')}
            className="h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
            aria-invalid={!!errors.assunto}
            aria-describedby={errors.assunto ? 'assunto-error' : undefined}
          >
            <option value="Informações gerais">Informações gerais</option>
            <option value="Agendamento de test drive">Agendamento de test drive</option>
            <option value="Negociação de preço">Negociação de preço</option>
            <option value="Financiamento">Financiamento</option>
            <option value="Outro">Outro</option>
          </select>
          {errors.assunto && (
            <span id="assunto-error" role="alert" className="text-sm text-red-600">
              {errors.assunto.message}
            </span>
          )}
        </div>

        <div className="stack gap-2">
          <label htmlFor="mensagem" className="text-sm font-medium">
            Mensagem <span className="text-red-600">*</span>
          </label>
          <textarea
            id="mensagem"
            {...register('mensagem')}
            placeholder="Descreva sua consulta ou interesse no veículo..."
            rows={5}
            className={cn(
              'flex w-full rounded-sm border border-input bg-background px-3 py-2 text-sm',
              'ring-offset-background',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'resize-none'
            )}
            aria-invalid={!!errors.mensagem}
            aria-describedby={errors.mensagem ? 'mensagem-error' : undefined}
          />
          <div className="flex justify-between items-center">
            {errors.mensagem ? (
              <span id="mensagem-error" role="alert" className="text-sm text-red-600">
                {errors.mensagem.message}
              </span>
            ) : (
              <span />
            )}
            <span
              className={cn('text-xs', charCount > 1000 ? 'text-red-600' : 'text-muted-foreground')}
            >
              {charCount}/1000
            </span>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('financiamento')} className="size-4 rounded" />
          <span className="text-sm">Tenho interesse em opções de financiamento</span>
        </label>
      </div>

      <div className="stack gap-4 pt-4 border-t border-border">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('termosPrivacidade')}
            className="size-4 rounded mt-0.5"
            aria-invalid={!!errors.termosPrivacidade}
            aria-describedby={errors.termosPrivacidade ? 'termosPrivacidade-error' : undefined}
          />
          <span className="text-sm">
            Li e concordo com os{' '}
            <a href="#" className="text-primary-600 underline hover:text-primary-700">
              termos de privacidade
            </a>{' '}
            <span className="text-red-600">*</span>
          </span>
        </label>
        {errors.termosPrivacidade && (
          <span id="termosPrivacidade-error" role="alert" className="text-sm text-red-600">
            {errors.termosPrivacidade.message}
          </span>
        )}

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('receberNovidades')}
            className="size-4 rounded mt-0.5"
          />
          <span className="text-sm">Desejo receber novidades e promoções por e-mail</span>
        </label>
      </div>

      <Button type="submit" disabled={isSubmitting || !isValid} className="w-full" size="lg">
        {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Ao enviar este formulário, você receberá um e-mail de confirmação com o número de protocolo
        e prazo estimado de resposta.
      </p>
    </form>
  );
};
