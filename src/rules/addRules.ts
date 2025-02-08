import {z} from 'zod'
export const addUser = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Max length is 255'),
    email: z.string().email('invalid email'),
})

export const updateUser = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Max length is 255').optional(),
    email: z.string().email('invalid email').optional(),
})