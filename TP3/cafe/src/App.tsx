import { OrderProvider } from './components/pedido';
import Menu from './components/menu';
import OrderSummary from './components/orderSumary';

function App() {
  return (
    <OrderProvider>
      <div>
        <h1>☕ Cafetería</h1>
        <Menu />  
        <OrderSummary />  
      </div>
    </OrderProvider>
  );
}

export default App;
