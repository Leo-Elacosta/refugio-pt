'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface BookingProps {
  propertyId: string | number;
  pricePerNight: number;
}

export default function BookingForm({ propertyId, pricePerNight }: BookingProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Dados fixos para o MVP
  const totalNights = 5;
  const totalPrice = (pricePerNight || 0) * totalNights;

  const handleBooking = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Por favor, faça login para reservar.');
      router.push('/login');
      return;
    }

    const { error } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: user.id,
          property_id: propertyId,
          start_date: "2026-06-10",
          end_date: "2026-06-15",
          total_price: totalPrice,
          status: 'Confirmada'
        }
      ]);

    if (error) {
      console.error('Erro:', error);
      alert(`Erro no banco: ${error.message}`);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    /* O 'w-full' garante que ele preencha a coluna lateral, 
       mas o 'max-w-md' impede que ele estique demais em telas grandes */
    <div className="w-full max-w-md ml-auto bg-white p-8 rounded-3xl border border-sky-100 shadow-2xl shadow-sky-100/50 sticky top-28">
      
      {/* Preço e Cabeçalho do Card */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-sky-950">
              {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(pricePerNight || 0)}
            </span>
            <span className="text-sky-500 font-medium text-sm">/ noite</span>
          </div>
        </div>
      </div>

      {/* Botão de Ação Principal */}
      <button
        onClick={handleBooking}
        disabled={loading || !pricePerNight}
        className="w-full py-4 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-sky-200 flex justify-center items-center gap-2 text-lg active:scale-[0.98]"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Reservando...
          </div>
        ) : (
          'Reservar Agora'
        )}
      </button>

      {/* Detalhamento de Valores */}
      <div className="mt-8 space-y-4">
        <div className="flex justify-between text-sky-800 text-sm">
          <span className="underline cursor-help">
            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(pricePerNight)} x {totalNights} noites
          </span>
          <span className="font-semibold">
            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(totalPrice)}
          </span>
        </div>
        
        <div className="flex justify-between text-sky-800 text-sm">
          <span className="underline cursor-help">Taxa de limpeza</span>
          <span className="text-green-600 font-bold uppercase text-[10px] bg-green-50 px-2 py-1 rounded">Grátis</span>
        </div>

        <div className="pt-4 border-t border-sky-50 flex justify-between items-center">
          <span className="text-lg font-bold text-sky-950">Total</span>
          <span className="text-lg font-black text-sky-950">
            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(totalPrice)}
          </span>
        </div>
      </div>

      {/* Footer do Card */}
      <p className="text-center text-[11px] text-sky-400 mt-6 font-medium">
        🛡️ Reserva segura via Refúgio Portugal
      </p>
    </div>
  );
}