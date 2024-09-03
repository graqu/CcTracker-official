import MainNavigation from '@/components/ui/MainNavigation';
import { Outlet } from 'react-router';

const RootLayout = () => {
  return (
    <>
      <MainNavigation />
      <div className="center">
        <Outlet />
      </div>
    </>
  );
};

export default RootLayout;
