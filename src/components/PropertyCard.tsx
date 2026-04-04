import Link from 'next/link';
import { Dog, CarFront, Ban } from 'lucide-react';

export interface PropertyType {
  id: string;
  title: string;
  location: string;
  image_url: string;
  price_per_day: number;
  accepts_pets: boolean;
  has_parking: boolean;
}

export function PropertyCard({ property }: { property: PropertyType }) {
  return (
    <Link 
      href={`/properties/${property.id}`}
      className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group border border-sky-50 w-full max-w-[380px] flex flex-col"
    >
      <div className="relative h-64 overflow-hidden shrink-0 bg-slate-100">
        <img 
          src={property.image_url} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-xl shadow-sm">
          <span className="text-[10px] font-black text-sky-950 uppercase tracking-widest">{property.location}</span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-lg font-bold text-sky-950 mb-4 line-clamp-2 leading-tight">
            {property.title}
          </h3>
          
          {/* Badges de Comodidades */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${property.accepts_pets ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-400'}`}>
              {property.accepts_pets ? <Dog size={14} /> : <Ban size={14} />}
              {property.accepts_pets ? 'Aceita Pets' : 'Sem Pets'}
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${property.has_parking ? 'bg-sky-50 text-sky-700' : 'bg-slate-50 text-slate-400'}`}>
              {property.has_parking ? <CarFront size={14} /> : <Ban size={14} />}
              {property.has_parking ? 'Com Garagem' : 'Sem Garagem'}
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-1 pt-4 border-t border-sky-50 mt-auto">
          <span className="text-2xl font-black text-sky-600">
            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(property.price_per_day || 0)}
          </span>
          <span className="text-sky-400 text-xs font-bold uppercase tracking-wide">/ dia</span>
        </div>
      </div>
    </Link>
  );
}