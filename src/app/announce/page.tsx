'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, MapPin, Euro, Image as ImageIcon, Dog, CarFront, Loader2 } from 'lucide-react';

export default function AnunciarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Estado para guardar os dados do formulário
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    price_per_day: '',
    image_url: '',
    accepts_pets: false,
    has_parking: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Precisa de fazer login para anunciar um imóvel.');
      router.push('/login');
      return;
    }

    // Inserir no Supabase
    const { error } = await supabase.from('properties').insert([
      {
        title: formData.title,
        location: formData.location,
        description: formData.description,
        price_per_day: Number(formData.price_per_day),
        image_url: formData.image_url,
        accepts_pets: formData.accepts_pets,
        has_parking: formData.has_parking,
        // user_id: user.id // Descomente isto se a sua tabela tiver uma coluna user_id para saber quem é o dono
      }
    ]);

    if (error) {
      alert(`Erro ao cadastrar: ${error.message}`);
      setLoading(false);
    } else {
      router.push('/'); // Volta para a página principal para ver o imóvel novo
    }
  };

  return (
    <div className="min-h-screen bg-[#84888c] py-10 px-6 flex flex-col items-center">
      
      {/* HEADER SIMPLES */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <Link href="/" className="text-white font-bold hover:opacity-70 transition-opacity flex items-center gap-2">
          &larr; Voltar ao Início
        </Link>
        <span className="text-white/80 font-medium text-sm tracking-widest uppercase">Novo Refúgio</span>
      </div>

      {/* FORMULÁRIO */}
      <div className="w-full max-w-3xl bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl border border-sky-50">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-200 rotate-3">
            <Home size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-sky-950 tracking-tighter uppercase">Anuncie o seu Espaço</h1>
          <p className="text-slate-500 font-medium mt-2">Preencha os detalhes e comece a receber hóspedes hoje mesmo.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TÍTULO */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-sky-900 uppercase tracking-widest mb-2 ml-2">Título do Anúncio</label>
              <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-4 focus-within:border-sky-500 focus-within:bg-white transition-all">
                <input 
                  required
                  type="text" 
                  placeholder="Ex: Apartamento com vista mar..."
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-transparent outline-none text-sky-950 font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* LOCALIZAÇÃO */}
            <div>
              <label className="block text-[10px] font-bold text-sky-900 uppercase tracking-widest mb-2 ml-2">Localização</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4 focus-within:border-sky-500 focus-within:bg-white transition-all">
                <MapPin size={20} className="text-slate-400" />
                <select 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-transparent outline-none text-sky-950 font-medium cursor-pointer"
                >
                  <option value="" disabled>Selecione a região</option>
                  <option value="Lisboa">Lisboa</option>
                  <option value="Porto">Porto</option>
                  <option value="Braga">Braga</option>
                  <option value="Algarve">Algarve</option>
                </select>
              </div>
            </div>

            {/* PREÇO POR DIA */}
            <div>
              <label className="block text-[10px] font-bold text-sky-900 uppercase tracking-widest mb-2 ml-2">Valor por Dia</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4 focus-within:border-sky-500 focus-within:bg-white transition-all">
                <Euro size={20} className="text-slate-400" />
                <input 
                  required
                  type="number" 
                  min="1"
                  placeholder="Ex: 80"
                  value={formData.price_per_day}
                  onChange={(e) => setFormData({...formData, price_per_day: e.target.value})}
                  className="w-full bg-transparent outline-none text-sky-950 font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* IMAGEM (URL) */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-sky-900 uppercase tracking-widest mb-2 ml-2">Link da Fotografia</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4 focus-within:border-sky-500 focus-within:bg-white transition-all">
                <ImageIcon size={20} className="text-slate-400" />
                <input 
                  required
                  type="url" 
                  placeholder="https://exemplo.com/foto.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full bg-transparent outline-none text-sky-950 font-medium placeholder:text-slate-400 text-sm"
                />
              </div>
            </div>

            {/* DESCRIÇÃO */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-sky-900 uppercase tracking-widest mb-2 ml-2">Descrição do Espaço</label>
              <div className="flex items-start bg-slate-50 border border-slate-100 rounded-2xl p-4 focus-within:border-sky-500 focus-within:bg-white transition-all">
                <textarea 
                  required
                  rows={4}
                  placeholder="Fale um pouco sobre as qualidades do seu refúgio..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-transparent outline-none text-sky-950 font-medium placeholder:text-slate-400 resize-none"
                />
              </div>
            </div>

            {/* COMODIDADES (BOTÕES TOGGLE) */}
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={() => setFormData({...formData, accepts_pets: !formData.accepts_pets})}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all font-bold ${
                  formData.accepts_pets ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                <Dog size={20} />
                {formData.accepts_pets ? 'Pets Aceites' : 'Não Aceita Pets'}
              </button>

              <button
                type="button"
                onClick={() => setFormData({...formData, has_parking: !formData.has_parking})}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all font-bold ${
                  formData.has_parking ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                <CarFront size={20} />
                {formData.has_parking ? 'Tem Garagem' : 'Sem Garagem'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-sky-200 flex justify-center items-center gap-2 text-sm active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publicar Anúncio'}
          </button>
        </form>

      </div>
    </div>
  );
}