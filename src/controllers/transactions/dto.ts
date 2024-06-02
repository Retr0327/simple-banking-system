import { z } from 'zod';

export const transactionSchema = z.object({
  account: z.string().min(1, 'Required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  amount: z.number().int().positive(),
});

export type TransactionDto = z.infer<typeof transactionSchema>;

export const transferSchema = z.object({
  account: z.string().min(1, 'Required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  targetAccount: z.string().min(1, 'Required'),
  amount: z.number().int().positive(),
});

export type TransferDto = z.infer<typeof transferSchema>;
