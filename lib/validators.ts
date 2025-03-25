import {  z } from 'zod'
import { fromatNumberWithDecimal } from './utils'
//Product validator for inserting products
const currency = z
.string()
.refine(
  (value) =>
    /^\d+(\.\d{2})?$/.test(fromatNumberWithDecimal(Number(value))),
  {
    message: "Price must have exactly two decimal places",
  }
)
export const insertProductSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    slug: z.string().min(3, 'slug must be at least 3 characters'),
    category: z.string().min(3, 'category must be at least 3 characters'),
    brand: z.string().min(3, 'brand must be at least 3 characters'),
    description: z.string().min(3, 'description must be at least 3 characters'),
    stock:z.coerce.number(),
    images:z.array(z.string()).min(1, 'Product must atleast have 1 image'),
    isFeatured:z.boolean(),
    banner:z.string().nullable(),
    price:currency,
})