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

//schema for signing user in
export const signInFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'password must be atleast 6 characters'),
});

export const signUpFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'password must be atleast 6 characters'),
  confirmPassword: z.string().min(6, 'password must be atleast 6 characters'),

}).refine((data)=>data.password === data.confirmPassword, {
  message:"Passwords don't match",
  path:['confirmPassword'],
});

//Cart Schema
export const cartItemSchema = z.object({
  productId:z.string().min(1, 'Product is required'),
  name:z.string().min(1, 'Name is required'),
  slug:z.string().min(1, 'Slug is required'),
  qty:z.number().int().nonnegative('quantity must be non-negative'),
  image:z.string().min(1, 'image is required'),
  price:currency,
})

export const InsertcartSchema = z.object({
  items:z.array(cartItemSchema),
  ItemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId:z.string().min(1, 'session cart id is required'),
  userId: z.string().optional().nullable(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  streetAddress: z.string().min(3, 'Address must be atleast 3 charcters'),
  city: z.string().min(3, 'city must be at least 3 characters'),
  postalCode: z.string().min(3, 'postalCode must be at least 3 characters'),
  country: z.string().min(3, 'country must be at least 3 characters'),
  lat:z.number().optional(),
  lng:z.number().optional(),

});
