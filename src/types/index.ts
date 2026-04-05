export interface Property {
    id: string;
    title: string;
    description: string;
    price_per_day: number;
    location: string;
    image_url: string;
    owner_id?: string;
    created_at: string;
}

export interface Booking {
  id: string;
  check_in: string;
  status: string;
  property_id: string;
  properties: {
    title: string;
    location: string;
  };
}