export interface Property {
    id: string;
    title: string;
    location: string;
    image_url: string;
    price_per_day: number;
    accepts_pets: boolean;
    has_parking: boolean;
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