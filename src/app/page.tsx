'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { UserCircle, Loader2, Dog, CarFront } from 'lucide-react';
import { PropertyCard, PropertyType } from '@/components/PropertyCard';

export default function Home() {

  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados dos Filtros
  const [category, setCategory] = useState("Todos");
  const [needsPets, setNeedsPets] = useState(false);
  const [needsParking, setNeedsParking] = useState(false);

  const categories = ["Todos", "Lisboa", "Porto", "Braga", "Algarve"];

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      
      let query = supabase.from('properties').select('*');

      if (category !== "Todos") {
        query = query.eq('location', category);
      }
      if (needsPets) {
        query = query.eq('accepts_pets', true);
      }
      if (needsParking) {
        query = query.eq('has_parking', true);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (!error && data) {
        setProperties(data as PropertyType[]);
      }
      setLoading(false);
    }

    fetchProperties();
  }, [category, needsPets, needsParking]);

  return (
    <div className="min-h-screen bg-[#84888c]">

      <main className="max-w-7xl mx-auto p-6 pt-10 flex flex-col items-center">
        
        {/* ÁREA DE FILTROS */}
        <div className="w-full bg-white p-6 rounded-3xl shadow-xl border border-sky-50 mb-10 flex flex-col lg:flex-row gap-6 justify-between items-center">
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  category === cat 
                    ? "bg-sky-600 text-white shadow-lg shadow-sky-200" 
                    : "bg-slate-50 text-slate-500 hover:bg-sky-50 hover:text-sky-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 w-full lg:w-auto justify-center">
            <button 
              onClick={() => setNeedsPets(!needsPets)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${needsPets ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
            >
              <Dog size={18} /> Pets
            </button>
            <button 
              onClick={() => setNeedsParking(!needsParking)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${needsParking ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
            >
              <CarFront size={18} /> Garagem
            </button>
          </div>
        </div>

        {/* LISTAGEM DE IMÓVEIS */}
        {loading ? (
          <div className="py-20">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full justify-items-center pb-20">
            {/* Trocamos o 'any' por 'PropertyType' aqui também */}
            {properties.map((property: PropertyType) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="w-full max-w-2xl text-center py-20 bg-white rounded-[2.5rem] border border-sky-50 shadow-xl mt-4">
            <span className="text-5xl mb-6 block">🧭</span>
            <h3 className="text-2xl font-black text-sky-950 mb-2 uppercase tracking-tighter">Nenhum refúgio atende aos critérios</h3>
            <p className="text-slate-500 font-medium">Tente ajustar os filtros de localização ou comodidades.</p>
            <button onClick={() => { setCategory("Todos"); setNeedsPets(false); setNeedsParking(false); }} className="mt-6 px-8 py-3 bg-sky-100 text-sky-700 font-bold rounded-xl hover:bg-sky-200 transition-colors text-sm uppercase tracking-widest">
              Limpar Filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
}