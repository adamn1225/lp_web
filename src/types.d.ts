interface Property {
  name?: string;
  photo: string;
  price: number;
  address: string;
  bedrooms: number;
  bathroom: number;
  livingArea: number;
  realtor?: {
    name: string;
    phone: string;
    photo: string;
  }
}
