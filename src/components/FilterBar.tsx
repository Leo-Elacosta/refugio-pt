'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const cities = ['Todos', 'Lisboa', 'Porto', 'Braga', 'Algarve'];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLocation = searchParams.get('location') || 'Todos';

  const handleFilter = (city: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (city === 'Todos') {
      params.delete('location');
    } else {
      params.set('location', city);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-3 overflow-x-auto px-1 pt-1 pb-4 scrollbar-hide">
      {cities.map((city) => (
        <button
          key={city}
          onClick={() => handleFilter(city)}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm ${
            currentLocation === city
              ? 'bg-sky-500 text-white shadow-sky-300/50 ring-2 ring-sky-500 ring-offset-2'
              : 'bg-white text-sky-700 hover:bg-sky-50 border border-sky-100 hover:border-sky-300'
          }`}
        >
          {city}
        </button>
      ))}
    </div>
  );
}