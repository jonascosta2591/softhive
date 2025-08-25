import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const AlterarSenha = lazy(() => import('src/pages/alterar-senha'));
export const EsqueceuSenha = lazy(() => import('src/pages/esqueceu-senha'));


export const UserRegister = lazy(() => import('src/pages/register'));
export const Programas = lazy(() => import('src/pages/programas'));
export const MinhaConta = lazy(() => import('src/pages/minha-conta'));
export const Pagamento = lazy(() => import('src/pages/pagamento'));
export const LandingPage = lazy(() => import('src/pages/landing-page'));
export const Sair = lazy(() => import('src/pages/sair'));


export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      // { index: true, element: <p>Landing page</p> },
      { path: 'my-softwares', element: <DashboardPage /> },
      { path: 'softwares', element: <Programas /> },
      { path: 'minha-conta', element: <MinhaConta /> },
      // { path: 'blog', element: <BlogPage /> },
    ],
  },
  {
    path: '/',
    element: (
      <LandingPage/>
    ),
  },
  {
    path: 'pagamento',
    element: (
      <Pagamento />
    ),
  },
  {
    path: 'register',
    element: (
      <AuthLayout>
        <UserRegister />
      </AuthLayout>
    ),
  },
  {
    path: 'esqueceu-senha',
    element: (
      <AuthLayout>
        <EsqueceuSenha />
      </AuthLayout>
    ),
  },
  {
    path: 'alterar-senha',
    element: (
      <AuthLayout>
        <AlterarSenha />
      </AuthLayout>
    ),
  },
  {
    path: 'sair',
    element: (
      <AuthLayout>
        <Sair />
      </AuthLayout>
    ),
  },
  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
