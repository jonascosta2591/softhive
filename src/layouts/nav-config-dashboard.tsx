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
    title: 'Meus programas',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Programas',
    path: '/programas',
    icon: icon('ic-cart'),
  },
  {
    title: 'Meus Dados',
    path: '/meus-dados',
    icon: icon('ic-user'),
  },
  {
    title: 'Sair',
    path: '/sair',
    icon: icon('ic-lock'),
  },
];
