export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME||'pro-store';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION||'Moderen store built with Next.js';
export const SERVER_URL = process.env.SERVER_URL||'http://localhost:3000';
export const LATEST_PRODUCT_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
    email : '',
    password: '',
};

export const signUpDefaultValues = {
    name:'',
    email : '',
    password: '',
    confirmPassword:'',
};

export const shippingAddressDefaultValues = {
    fullName:'',
    streetAddress : '',
    city: '',
    postalCode:'',
    country:''
};

 