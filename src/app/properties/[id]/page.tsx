import { supabase } from '@/lib/supabase';
import BookingForm from './bookingForm'; 
import Link from 'next/link';

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !property) {
    return <div className="p-20 text-center">Imóvel não encontrado.</div>;
  }

  // ATUALIZADO: Agora busca especificamente pela coluna 'price_per_day'
  const valorDiaria = property.price_per_day || 0;

  return (
    <div className="min-h-screen bg-white">
      <nav className="p-6 max-w-7xl mx-auto">
        <Link href="/" className="text-sky-600 font-bold hover:opacity-70 transition-opacity">
          &larr; Voltar
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-black text-sky-950 mb-2">{property.title}</h1>
        <p className="text-sky-600 mb-8 font-medium">📍 {property.location}</p>

        <div className="w-full h-[450px] rounded-3xl overflow-hidden mb-12 shadow-lg">
          <img 
            src={property.image_url} 
            alt={property.title} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-sky-950 mb-4">Sobre o espaço</h2>
            <p className="text-sky-800 leading-relaxed text-lg italic">
              {property.description || "Descrição em breve..."}
            </p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-sky-50 text-sky-700 font-medium">✨ Limpeza impecável</div>
              <div className="p-4 rounded-2xl bg-sky-50 text-sky-700 font-medium">🔑 Check-in autônomo</div>
              <div className="p-4 rounded-2xl bg-sky-50 text-sky-700 font-medium">🌐 Wi-fi rápido</div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Passamos o valor extraído da coluna price_per_day */}
            <BookingForm propertyId={property.id} pricePerNight={valorDiaria} />
          </div>
        </div>
      </main>
    </div>
  );
}