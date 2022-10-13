export interface FoodItem {
    id: number;
    name: string;
    description: string;
    price: number;
    available: boolean;
    image: string;
  }
  
  export type Food = Omit<FoodItem, "id" | "available">;