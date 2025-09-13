
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import { FlashDeals } from "./flash-deals";

async function getFlashDeals() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_flash_deal', true)
            .order('created_at', { ascending: false })
            .limit(8);

        if (error) {
          console.error("Error fetching flash deals:", error);
          return [];
        };
        return data as Product[];
    } catch (error) {
        console.error("Error fetching flash deals:", error);
        return [];
    }
}

export async function FlashDealsServer() {
    const products = await getFlashDeals();
    return <FlashDeals products={products} />;
}

