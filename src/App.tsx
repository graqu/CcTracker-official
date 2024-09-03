import { RouterProvider } from 'react-router-dom';
import { router } from './Router';
import CoinGeckoContextProvider from './store/CoinsDataStore';

function App() {
  return (
    <CoinGeckoContextProvider>
      <RouterProvider router={router} />
    </CoinGeckoContextProvider>
  );
}

export default App;
