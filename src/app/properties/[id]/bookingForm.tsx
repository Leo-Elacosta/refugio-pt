'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface BookingProps {
  propertyId: string | number;
  pricePerNight: number;
}

export default function BookingForm({ propertyId, pricePerNight }: BookingProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [bookedDates, setBookedDates] = useState<{start: string, end: string}[]>([]);

  useEffect(() => {
  async function loadBookings() {
    const { data } = await supabase.from('bookings').select('start_date, end_date').eq('property_id', propertyId);
    if (data) {
      setBookedDates(data.map(d => ({ start: d.start_date, end: d.end_date })));
    }
  }
  loadBookings();
}, [propertyId]);

  // --- CÁLCULO DO PREÇO ---
  let totalNights = 0;
  let totalPrice = 0;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      totalNights = diffDays;
      totalPrice = diffDays * pricePerNight;
    }
  }

  const handleBooking = async () => {
    // 1. Validação básica de datas
    if (totalPrice <= 0) {
      alert("Selecione um intervalo de datas válido (o check-out deve ser após o check-in).");
      return;
    }

    setLoading(true);

    // 2. Verificação de Utilizador
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Faça login para reservar!");
      router.push('/login');
      return;
    }

    // NOVA LÓGICA: PREVENÇÃO DE RESERVA DUPLA
  
    const { data: existingBookings, error: fetchError } = await supabase
      .from('bookings')
      .select('start_date, end_date')
      .eq('property_id', propertyId);

    if (fetchError) {
      alert(`Erro ao verificar disponibilidade: ${fetchError.message}`);
      setLoading(false);
      return;
    }

    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    const hasOverlap = existingBookings?.some(booking => {
      const bookedStart = new Date(booking.start_date);
      const bookedEnd = new Date(booking.end_date);

      return (newStart < bookedEnd && newEnd > bookedStart);
    });

    if (hasOverlap) {
      alert("❌ Desculpe, este refúgio já está reservado para essas datas. Por favor, escolha outro período.");
      setLoading(false);
      return;
    }
    // ==========================================

    const { error } = await supabase.from('bookings').insert([
      {
        user_id: user.id,
        property_id: propertyId,
        start_date: startDate,
        end_date: endDate,
        total_price: totalPrice,
        status: 'confirmed'
      }
    ]);

    if (error) {
      alert(`Erro no banco: ${error.message}`);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  // Restrição extra: Impedir de selecionar datas no passado no calendário
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full bg-white p-8 rounded-3xl border border-sky-100 shadow-2xl shadow-sky-100/50 sticky top-28">
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-sky-950">
            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(pricePerNight)}
          </span>
          <span className="text-sky-500 font-medium text-sm"> / noite</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-2 border border-sky-100 rounded-2xl overflow-hidden">
          <div className="p-3 border-r border-sky-100">
            <label className="block text-[10px] font-bold text-sky-900 uppercase mb-1">Check-in</label>
            <input 
              type="date" 
              min={today} // Impede datas passadas
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-sm text-sky-600 focus:outline-none bg-transparent"
            />
          </div>
          <div className="p-3">
            <label className="block text-[10px] font-bold text-sky-900 uppercase mb-1">Check-out</label>
            <input 
              type="date" 
              min={startDate || today} // O checkout não pode ser antes do check-in
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full text-sm text-sky-600 focus:outline-none bg-transparent"
            />
          </div>
        </div>
      </div>

      {bookedDates.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3 block">Datas Indisponíveis:</span>
          <div className="flex flex-wrap gap-2">
            {bookedDates.map((date, index) => (
              <div key={index} className="bg-white px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-500 border border-amber-200 shadow-sm">
                {new Date(date.start).toLocaleDateString('pt-PT')} — {new Date(date.end).toLocaleDateString('pt-PT')}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleBooking}
        disabled={loading || totalPrice <= 0}
        className="w-full py-4 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-2xl transition-all shadow-lg flex justify-center items-center gap-2 text-lg active:scale-[0.98]"
      >
        {loading ? 'A processar...' : 'Reservar Agora'}
      </button>

      {totalPrice > 0 && (
        <div className="mt-6 pt-6 border-t border-sky-50 flex justify-between items-center">
          <span className="text-sm text-sky-600 font-medium italic">{totalNights} noites selecionadas</span>
          <span className="text-xl font-bold text-sky-950">
            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(totalPrice)}
          </span>
        </div>
      )}
    </div>
  );
}