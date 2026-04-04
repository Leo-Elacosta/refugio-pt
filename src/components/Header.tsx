'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
// Importamos o tipo 'User' oficial do Supabase
import { User } from '@supabase/supabase-js'; 
import { UserCircle, LogOut, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  // Agora o TypeScript sabe exatamente os dados que o 'user' tem!
  const extractName = (user: User | null) => {
    if (!user) return null;
    
    // 1. Tenta pegar o nome completo ou primeiro nome dos metadados
    const metaName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (metaName) return metaName;

    // 2. Se não houver nome, formata a primeira parte do e-mail
    if (user.email) {
      const emailPart = user.email.split('@')[0];
      // Coloca a primeira letra em maiúscula
      return emailPart.charAt(0).toUpperCase() + emailPart.slice(1);
    }

    return 'Utilizador';
  };

  useEffect(() => {
    // Busca o utilizador atual quando a página carrega
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserName(extractName(user));
    };
    getUser();

    // Esta função "ouve" as mudanças (login/logout) e atualiza o menu em tempo real!
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserName(extractName(session?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-sky-100 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGOTIPO */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-200 group-hover:rotate-12 transition-transform">
              <span className="text-white font-black text-xl">R</span>
            </div>
            <span className="hidden md:block text-xl font-black text-sky-950 tracking-tighter uppercase italic">
              Refúgio<span className="text-sky-600">.pt</span>
            </span>
          </Link>
        </div>

        {/* MENU DIREITO */}
        <div className="flex items-center gap-4">
          {userName ? (
            // SE ESTIVER LOGADO
            <>
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Bem-vindo</span>
                {/* Aqui aplicamos o limite de tamanho (truncate) para nomes muito longos */}
                <span className="text-sm font-bold text-sky-950 max-w-[150px] truncate" title={userName}>
                  {userName}
                </span>
              </div>
              <button onClick={handleLogout} className="p-2 hover:bg-red-50 text-red-400 rounded-xl transition-colors" title="Sair">
                <LogOut size={20} />
              </button>
              <Link href="/dashboard" className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center text-sky-600 border border-sky-100 hover:bg-sky-100 transition-colors" title="Meu Dashboard">
                <UserCircle size={28} />
              </Link>
            </>
          ) : (
            // SE NÃO ESTIVER LOGADO
            <Link href="/login" className="flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-sky-700 transition-all text-sm shadow-md shadow-sky-200">
              <LogIn size={18} />
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}