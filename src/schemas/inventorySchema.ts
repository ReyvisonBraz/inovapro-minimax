import { z } from 'zod';

export const inventorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200),
  category: z.enum(['product', 'service']),
  sku: z.string().max(50).optional().nullable(),
  unitPrice: z.number().min(0, 'Preço deve ser positivo'),
  costPrice: z.number().min(0).optional().default(0),
  salePrice: z.number().min(0).optional().default(0),
  quantity: z.number().int().min(0).optional().default(0),
  minQuantity: z.number().int().min(0).optional().default(5),
  stockLevel: z.number().int().min(0).optional().default(0)
});

export type InventoryFormData = z.infer<typeof inventorySchema>;
