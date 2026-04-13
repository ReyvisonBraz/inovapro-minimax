import { z } from 'zod';

export const modelSchema = z.object({
  brandId: z.number().int().positive('Selecione uma marca'),
  name: z.string().min(1, 'Nome é obrigatório').max(100)
});

export type ModelFormData = z.infer<typeof modelSchema>;
