// src/sections/overview/view/overview-analytics-view.tsx
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { CardMedia, Skeleton, CircularProgress, LinearProgress, Alert, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import axios from 'axios';

import { DashboardContent } from 'src/layouts/dashboard';

type typePrograms = {
  idsoftwares_para_comprar: number;
  link_drive: string;
  nome_software: string;
  imagem: string;
  price: string;
  category: string;
  description: string;
};

export function OverviewAnalyticsView() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = './sign-in';
  }, []);

  useEffect(() => {
    const softwareEscolhido = localStorage.getItem('softwareEscolhido');
    if (softwareEscolhido) window.location.href = `./pagamento?id=${softwareEscolhido}`;
  }, []);

  const [programas, setProgramas] = useState<typePrograms[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('token');

    setLoading(true);
    setError(null);

    axios
      .get(`${import.meta.env.VITE_API_URL}/my-softwares/my-softwares`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (!isMounted) return;
        setProgramas(response.data || []);
      })
      .catch((err) => {
        console.error(err);
        if (!isMounted) return;
        setError('Ocorreu um erro na comunicação com o servidor. Tente novamente.');
      })
      .finally(() => {
        if (!isMounted) return;
        setTimeout(() => setLoading(false), 500);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const brand = { primary: '#141556', hover: '#00A9C4' };

  const CARD_W = 239;   // 205 img + 16 + 16 padding + 1 + 1 borda
  const IMG_W  = 205;
  const IMG_H  = 200;

  const SkeletonCard = () => (
    <Card
      variant="outlined"
      sx={{
        width: CARD_W,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Skeleton variant="rectangular" width={IMG_W} height={IMG_H} sx={{ borderRadius: 2, mb: 2 }} />
      <Skeleton variant="text" width={180} height={28} sx={{ mb: 1 }} />
      <Skeleton variant="rounded" width={120} height={36} />
    </Card>
  );

  return (
    <DashboardContent maxWidth="xl">
      <Box
        sx={{
          mb: { xs: 3, md: 5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="h4">Meus Softwares</Typography>

        {!loading && programas.length > 0 && (
          <Button
          href="./softwares"
          variant="contained"
          sx={{ backgroundColor: brand.primary, '&:hover': { backgroundColor: brand.hover } }}>
            Obtenha mais
          </Button>
        )}
      </Box>

      {loading && (
        <Box sx={{ mb: 3 }} aria-busy>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="body1">Carregando seus softwares…</Typography>
          </Stack>
          <LinearProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {!loading && !error && programas.length === 0 && (
        <Card
          variant="outlined"
          sx={{
            p: { xs: 3, md: 5 },
            mb: 3,
            textAlign: 'center',
            borderStyle: 'dashed',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Nenhum software obtido
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Assim que sua compra for confirmada, ela aparecerá aqui.
          </Typography>
          <Button
            href="./softwares"
            variant="contained"
            sx={{ backgroundColor: brand.primary, '&:hover': { backgroundColor: brand.hover } }}
          >
            Comprar softwares
          </Button>
        </Card>
      )}

      {/* LISTA: mesmíssimo tamanho do arquivo inicial */}
      {!loading && !error && programas.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            // Colunas fixas de 239px para manter exatamente o mesmo “tile” do original
            gridTemplateColumns: 'repeat(auto-fill, 239px)',
            // Centraliza quando sobrar espaço na linha
            justifyContent: { xs: 'center', md: 'flex-start' },
          }}
        >
          {programas.map((programs: typePrograms) => (
            <Card
              key={programs.idsoftwares_para_comprar}
              variant="outlined"
              sx={{
                width: CARD_W,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <CardMedia
                component="img"
                sx={{ width: IMG_W, height: IMG_H, objectFit: 'contain' }}
                image={programs.imagem}
                alt={programs.description || programs.nome_software}
                loading="lazy"
              />
              <Typography variant="h6" sx={{ width: 200, height: 60, textAlign: 'center', mt: 1.5 }}>
                {programs.nome_software}
              </Typography>

              <Button
                href={programs.link_drive}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                sx={{ mt: 1, backgroundColor: brand.primary, '&:hover': { backgroundColor: brand.hover } }}
              >
                Baixar
              </Button>
            </Card>
          ))}
        </Box>
      )}

      {loading && (
        <Box
          sx={{
            mt: 0,
            display: 'grid',
            gap: 3,
            gridTemplateColumns: 'repeat(auto-fill, 239px)',
            justifyContent: { xs: 'center', md: 'flex-start' },
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}
        </Box>
      )}
    </DashboardContent>
  );
}
