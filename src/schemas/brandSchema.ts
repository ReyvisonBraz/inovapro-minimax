import { z } from 'zod';

export const brandSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  equipmentType: z.string().max(100).optional().nullable()
});

export type BrandFormData = z.infer<typeof brandSchema>;
