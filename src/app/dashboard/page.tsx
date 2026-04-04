'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PropertyType } from '@/components/PropertyCard';
import { Loader2, Trash2, Home, Calendar as CalendarIcon, ExternalLink, UserCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BookingType {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  properties: {
    title: string;
    location: string;
    image_url: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'bookings' | 'my-properties'>('bookings');
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [myProperties, setMyProperties] = useState<PropertyType[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      if (isMounted) setUserEmail(user.email ?? 'Utilizador');

      const [bData, pData] = await Promise.all([
        supabase
          .from('bookings')
          .select('id, start_date, end_date, total_price, properties(title, location, image_url)')
          .eq('user_id', user.id),
        supabase
          .from('properties')
          .select('*')
          .eq('user_id', user.id)
      ]);

      if (isMounted) {
        if (bData.data) setBookings(bData.data as unknown as BookingType[]);
        if (pData.data) setMyProperties(pData.data as PropertyType[]);
        setLoading(false);
      }
    }

    loadDashboardData();
    return () => { isMounted = false; };
  }, [router]);

  // FUNÇÃO PARA EXCLUIR RESERVA (GUESTS)
  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Deseja mesmo cancelar esta reserva?")) return;
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (!error) setBookings(prev => prev.filter(b => b.id !== id));
  };

  // FUNÇÃO PARA EXCLUIR ANÚNCIO (OWNERS)
  const handleDeleteProperty = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este anúncio?")) return;
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (!error) setMyProperties(prev => prev.filter(p => p.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#84888c]">

      <main className="max-w-5xl mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">A Minha Conta</h1>
            <div className="flex gap-4 mt-4">
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'bookings' ? 'bg-white text-sky-600 shadow-xl' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                Minhas Reservas ({bookings.length})
              </button>
              <button 
                onClick={() => setActiveTab('my-properties')}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'my-properties' ? 'bg-white text-sky-600 shadow-xl' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                Meus Anúncios ({myProperties.length})
              </button>
            </div>
          </div>
          <Link href="/announce" className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg transition-transform active:scale-95">
            + Novo Anúncio
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-white w-12 h-12" /></div>
        ) : (
          <div className="space-y-4">
            
            {/* ABA: MINHAS RESERVAS */}
            {activeTab === 'bookings' && (
              bookings.length > 0 ? bookings.map(b => (
                <div key={b.id} className="bg-white rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 items-center border border-sky-50 shadow-xl group">
                  <img src={b.properties.image_url} alt="" className="w-full md:w-32 h-24 object-cover rounded-2xl" />
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-black text-sky-950 uppercase">{b.properties.title}</h3>
                    <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-tighter">
                      {new Date(b.start_date).toLocaleDateString()} — {new Date(b.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="block text-[10px] font-black text-sky-400 uppercase">Total</span>
                      <span className="text-xl font-black text-sky-600">{b.total_price}€</span>
                    </div>
                    {/* BOTÃO EXCLUIR RESERVA RE-ADICIONADO */}
                    <button 
                      onClick={() => handleDeleteBooking(b.id)}
                      className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )) : <EmptyState msg="Você não tem reservas ativas." />
            )}

            {/* ABA: MEUS ANÚNCIOS */}
            {activeTab === 'my-properties' && (
              myProperties.length > 0 ? myProperties.map(p => (
                <div key={p.id} className="bg-white rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 items-center border border-sky-50 shadow-xl group">
                  <img src={p.image_url} alt="" className="w-full md:w-32 h-24 object-cover rounded-2xl" />
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-black text-sky-950 uppercase">{p.title}</h3>
                    <p className="text-sky-600 font-bold text-sm uppercase tracking-widest">{p.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/properties/${p.id}`} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-sky-50 hover:text-sky-600 transition-all">
                      <ExternalLink size={20} />
                    </Link>
                    <button 
                      onClick={() => handleDeleteProperty(p.id)}
                      className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )) : <EmptyState msg="Ainda não anunciou nenhum refúgio." />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="bg-white/10 border-2 border-dashed border-white/20 rounded-[3rem] py-20 text-center text-white/50 font-bold uppercase tracking-widest">
      {msg}
    </div>
  );
}