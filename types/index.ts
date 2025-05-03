import { z } from 'zod'
import { insertProductSchema, InsertcartSchema, cartItemSchema, shippingAddressSchema } from '@/lib/validators'


export type Product =z.infer<typeof insertProductSchema> & {
   id: string;
   rating:string;
   createdAt:Date;

}
export type Cart =z.infer<typeof InsertcartSchema>;
export type CartItem =z.infer<typeof cartItemSchema>;
export type shippingAddress =z.infer<typeof shippingAddressSchema>;