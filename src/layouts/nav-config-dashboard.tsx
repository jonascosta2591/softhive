import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Meus Softwares',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Comprar Softwares',
    path: '/programas',
    icon: icon('ic-cart'),
  },
  {
    title: 'Minha conta',
    path: '/minha-conta',
    icon: icon('ic-user'),
  },
  {
    title: 'Sair',
    path: '/sair',
    icon: icon('ic-lock'),
  },
];
