import { supabase } from "@/lib/supabase";
import { Property } from "@/types";

export async function getProperties(location?: string): Promise<Property[]> {
    let query = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (location && location !== 'Todos') {
        query = query.eq('location', location);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`Erro ao buscar propriedades`);
    }

    return data as Property[];
}

export async function getPropertyById(id: string): Promise<Property | null> {
    console.log("Buscando no banco pelo ID:", id);
    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) {
        console.error('Erro detalhado do Supabase:', error.message, error.details, error.hint);
        return null;
    }

    return data as Property;
}