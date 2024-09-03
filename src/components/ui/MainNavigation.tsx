import { NavLink } from 'react-router-dom';
import styles from './MainNavigation.module.css';
import { buttonVariants } from '@/components/ui/button';
import Logo from '@/assets/Logo.png';

const routes = [
  {
    id: 'nv01',
    path: '/',
    label: 'Home',
  },
  {
    id: 'nv02',
    path: '/user-portfolio',
    label: 'My Crypto',
  },
  {
    id: 'nv03',
    path: '/about',
    label: 'About',
  },
];

const MainNavigation = () => {
  return (
    <nav className={`${styles.navigation} border-b md:flex md:justify-between`}>
      <div className="flex items-center flex-col md:flex-row md:mb-0 mb-[16px]">
        <img src={Logo} alt="Logo" width="30px" />
        <div className="flex md:flex-row flex-col items-end">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 text-center ml-[20px] mr-[10px]">
            Tracker
          </h2>
          <p>follow your crypto</p>
        </div>
      </div>
      <div className="flex md:display-block justify-center">
        {routes.map((route) => (
          <NavLink
            key={route.id}
            className={({ isActive }) =>
              isActive
                ? buttonVariants({ variant: 'outline' })
                : buttonVariants({ variant: 'default' })
            }
            to={route.path}
          >
            <span className="m-0 text-[10px] md:[font-size:initial]">
              {route.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MainNavigation;
