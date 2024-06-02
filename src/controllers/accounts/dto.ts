import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z.string().min(1, 'Required').max(255),
  email: z.string().email('Invalid email').min(1, 'Required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  balance: z.number().int().positive().optional(),
});

export type CreateAccountDto = z.infer<typeof createAccountSchema>;

export const getAccountDetailSchema = z.object({
  email: z.string().email('Invalid email').min(1, 'Required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type GetAccountDetailDto = z.infer<typeof getAccountDetailSchema>;
