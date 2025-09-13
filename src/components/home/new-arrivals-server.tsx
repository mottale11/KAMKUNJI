
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import { NewArrivals } from "./new-arrivals";

async function getNewArrivals() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_new_arrival', true)
            .order('created_at', { ascending: false })
            .limit(8);

        if (error) {
          console.error("Error fetching new arrivals:", error);
          return [];
        }
        return data as Product[];
    } catch (error) {
        console.error("Error fetching new arrivals:", error);
        return [];
    }
}

export async function NewArrivalsServer() {
    const products = await getNewArrivals();
    return <NewArrivals products={products} />;
}

