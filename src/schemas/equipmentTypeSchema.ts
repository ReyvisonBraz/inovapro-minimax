import { z } from 'zod';

export const equipmentTypeSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  icon: z.string().max(50).optional().nullable()
});

export type EquipmentTypeFormData = z.infer<typeof equipmentTypeSchema>;
