import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://txetiirkzerxzaxturcc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4ZXRpaXJremVyeHpheHR1cmNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4ODgyNzgsImV4cCI6MjA5ODQ2NDI3OH0.amBNWiGNqjUfqVFPclidopS_0g9ik7cL7UrfEWhtDno'
);

async function inspectSchema() {
  console.log("Fetching products...");
  const { data: products, error: pErr } = await supabase.from('products').select('*').limit(1);
  if (pErr) console.error("Error fetching products:", pErr);
  else console.log("Products schema:", products.length > 0 ? Object.keys(products[0]) : "Empty table");

  console.log("\nFetching categories...");
  const { data: categories, error: cErr } = await supabase.from('categories').select('*').limit(1);
  if (cErr) console.error("Error fetching categories:", cErr);
  else console.log("Categories schema:", categories.length > 0 ? Object.keys(categories[0]) : "Empty table");
}

inspectSchema();
