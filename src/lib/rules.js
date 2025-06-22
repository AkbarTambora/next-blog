import { z } from 'zod';

export const RegisterFormSchema = z.object({
    email: z.string().email({
        message: 'Please enter a valid email.'
    }).trim(),
    password: z.string()
        .min(1, {message: 'Not be empty'})
        .min(5, {message: 'Must be at least 5 characters long'})
        .regex(/[a-zA-Z]/, {
            message: 'Must contain at least one letter'
        })
        .regex(/[0-9]/, {
            message: 'Must contain at least one number'
        })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Must contain at least one special character'
        })
        .trim(),
        confirmPassword: z.string().trim(),
}).superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        })
    }
});