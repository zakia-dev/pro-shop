import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// convert prisma object into regular js object
export function convertToPlainObject<T>(value: T): T{
  return(JSON. parse(JSON.stringify(value)))

}

//Format number with decimal places 
export function fromatNumberWithDecimal(num:number): string {
  const [int , decimal] =num.toString().split('.');
  return decimal ? `${int }.${decimal.padEnd(2,'0')}`:`${int}.00`

}

//format error function
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error:any) {
  if(error.name =='ZodError'){
    const feildErrors = Object.keys(error.errors).map((feild)=> error.errors[feild].message)
    return feildErrors.join('. ')
    //handle zod error 
  }
  else if(error.name ==='PrismaClientKnownRequestError' && error.code === 'P2002'){
    const feild = error.meta?.target? error.meta.target[0]:'Feild';
    return `${feild.charAt(0).toUpperCase() + feild.slice(1)} already exists`;
  }else{
    //handle other errors
    return typeof error.message === 'string' ? error.message:JSON.stringify(error.message)
  
  }
  
}


//round number to 2 decimal places
export function round2(value:number | string) {
  if(typeof value === 'number'){
    return Math.round((value + Number.EPSILON) *100)/100;

  } else if(typeof value === 'number'){
    return Math.round((Number(value) + Number.EPSILON) *100)/100;

  }else{
    throw new Error('Value is not a number or String')
  }
  
}


const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US',{
  currency:'USD',
  style:'currency',
  minimumFractionDigits:2
})

// format currency functionusing the above formater
export function formatCurrency(amount:number | string | null){
  if(typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount);
  } else if(typeof amount === 'string'){
    return CURRENCY_FORMATTER.format(Number(amount))
  }else{
    return 'NAN';
  }
}