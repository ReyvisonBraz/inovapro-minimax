import { z } from 'zod';

export const settingsSchema = z.object({
  appName: z.string().min(1).max(100),
  appVersion: z.string().max(50).optional(),
  fiscalYear: z.string().length(4),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  profileName: z.string().max(200).optional().nullable(),
  initialBalance: z.number().min(0).optional().default(0),
  receiptLayout: z.enum(['a4', 'thermal']).default('a4'),
  companyCnpj: z.string().max(20).optional().nullable(),
  companyAddress: z.string().max(500).optional().nullable(),
  pixKey: z.string().max(100).optional().nullable()
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
