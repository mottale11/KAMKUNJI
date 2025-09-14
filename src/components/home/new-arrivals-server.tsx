import { NewArrivals } from "@/components/home/new-arrivals";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";

async function getNewArrivals() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*, categories(name)')
            .eq('is_new_arrival', true)
            .order('created_at', { ascending: false })
            .limit(8);
        
        if (error) {
            console.error("Error fetching new arrivals:", error.message);
            return [];
        }
        return (data || []) as Product[];
    } catch (error) {
        console.error("Error fetching new arrivals:", error);
        return [];
    }
}

export async function NewArrivalsServer() {
    const newArrivals = await getNewArrivals();
    return <NewArrivals products={newArrivals} />;
}
