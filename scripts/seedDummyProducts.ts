import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing in environment variables');
}
if (!supabaseKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  { name: 'Vanilla', price: 12000, type: 'base' },
  { name: 'Chocolate', price: 13000, type: 'base' },
  { name: 'Strawberry', price: 13000, type: 'base' },
  { name: 'Matcha', price: 15000, type: 'base' },
  { name: 'Mango', price: 14000, type: 'base' },
];

const toppings = [
  { name: 'Oreo', price: 4000, type: 'topping' },
  { name: 'Almond', price: 5000, type: 'topping' },
  { name: 'Sprinkles', price: 3000, type: 'topping' },
  { name: 'Chocolate Chips', price: 3500, type: 'topping' },
  { name: 'Caramel Syrup', price: 4000, type: 'topping' },
];

async function seed() {
  try {
    const { error: baseError } = await supabase.from('products').insert(products);
    if (baseError) throw baseError;

    const { error: toppingError } = await supabase.from('products').insert(toppings);
    if (toppingError) throw toppingError;

    console.log('✅ Dummy products and toppings seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();