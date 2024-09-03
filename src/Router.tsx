import RootLayout from './routes/RootLayout';
import HomePage from './routes/Home';
import AboutPage from './routes/About';
import PortfolioPage from './routes/MyPortfolio';
import DetailsPage from './routes/CurrencyDetails';
import ErrorPage from './routes/Error';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'user-portfolio',
        element: <PortfolioPage />,
      },
      {
        path: 'currencies/:currencyId',
        element: <DetailsPage />,
      },
    ],
  },
]);
