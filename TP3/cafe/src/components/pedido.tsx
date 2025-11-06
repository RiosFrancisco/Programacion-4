import { createContext, useContext, useState, type ReactNode } from 'react';
import { type Product } from '../types/product';

type OrderContextType = {
  order: Product[];
  addToOrder: (product: Product) => void;
  removeFromOrder: (index: number) => void;
  clearOrder: () => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [order, setOrder] = useState<Product[]>([]);

  const addToOrder = (product: Product) => setOrder(prev => [...prev, product]);  // HU2

  
  const removeFromOrder = (index: number) =>
    setOrder(prev => {
      const newOrder = [...prev];
      newOrder.splice(index, 1);
      return newOrder;
    }); 

  const clearOrder = () => setOrder([]);  // HU5

  return (
    <OrderContext.Provider value={{ order, addToOrder, removeFromOrder, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
};


export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within OrderProvider');
  return context;
};

