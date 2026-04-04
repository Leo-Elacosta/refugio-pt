import { supabase } from '@/lib/supabase';
import { Booking } from '@/types';

export async function getBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      check_in,
      status,
      property_id,
      properties (
        title,
        location
      )
    `)
    .order('check_in', { ascending: true });

  if (error) {
    console.error('Erro ao buscar agendamentos:', error.message);
    return [];
  }

  return data as unknown as Booking[];
}

export async function createBooking(propertyId: string, checkInDate: string) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([
      { 
        property_id: propertyId, 
        check_in: checkInDate,
        status: 'pending' 
      }
    ]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}