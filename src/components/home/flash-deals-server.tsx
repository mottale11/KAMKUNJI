import { FlashDeals } from "@/components/home/flash-deals";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";

async function getFlashDeals() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*, categories(name)')
            .eq('is_flash_deal', true)
            .order('created_at', { ascending: false })
            .limit(8);

        if (error) {
            console.error("Error fetching flash deals:", error.message);
            return [];
        }
        return (data || []) as Product[];
    } catch (error) {
        console.error("Error fetching flash deals:", error);
        return [];
    }
}

export async function FlashDealsServer() {
    const flashDeals = await getFlashDeals();
    return <FlashDeals products={flashDeals} />;
}
