export interface Item {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  price: number;
  eventId: number; // an 'event' is a storefront 
}
