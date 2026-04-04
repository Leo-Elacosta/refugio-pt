'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; //ajuste o caminho se necessário

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    //cria o usuário no Supabase e salva o nome nos metadados
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      //se deu certo, manda para o Dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-sky-50/50 flex items-center justify-center p-6 selection:bg-sky-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-md shadow-sky-100/60 border border-sky-50">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-black text-sky-950 tracking-tighter mb-6">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white text-xs">R</div>
            REFÚGIO
          </Link>
          <h1 className="text-2xl font-extrabold text-sky-950 tracking-tight mb-2">Crie sua conta</h1>
          <p className="text-sky-600/80 font-medium text-sm">Junte-se a nós e comece a planejar sua viagem</p>
        </div>

        {/* Exibe mensagem de erro se houver */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-sky-900 mb-2">Nome completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João Silva"
              required
              className="w-full px-4 py-3 rounded-xl border border-sky-100 bg-sky-50/30 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all text-sky-900 font-medium placeholder:text-sky-300"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-sky-900 mb-2">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-sky-100 bg-sky-50/30 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all text-sky-900 font-medium placeholder:text-sky-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-sky-900 mb-2">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo de 6 caracteres"
              required
              className="w-full px-4 py-3 rounded-xl border border-sky-100 bg-sky-50/30 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all text-sky-900 font-medium placeholder:text-sky-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold rounded-xl transition-colors shadow-sm shadow-sky-200 mt-4 flex justify-center items-center"
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-sky-600/80">
            Já tem uma conta?{' '}
            <Link href="/login" className="font-bold text-sky-600 hover:text-sky-800 transition-colors">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}