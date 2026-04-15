export interface IProducts {
  id?: number;
  name: string;
  description: string;
  price: number;

  status: string;
  category: string;
  amount: number;
  isOnPromotion: boolean;

  image?: string;
  createdAt?: string;
}