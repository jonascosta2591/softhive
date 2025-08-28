// src/sections/overview/view/programas.tsx
import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { CardMedia, Typography, TextField, CircularProgress, Alert, Stack, Skeleton } from '@mui/material';
import axios from 'axios';
import { DashboardContent } from 'src/layouts/dashboard';

type typePrograms = {
  id: number;
  name: string;
  image: string;
  price: string;
  category: string;
  description: string;
};

type MySoftware = {
  idsoftwares_para_comprar: number;
};

export function Programas() {
  // auth gate
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = './sign-in';
  }, []);

  const [allPrograms, setAllPrograms] = useState<typePrograms[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let alive = true;
    const token = localStorage.getItem('token');

    setLoading(true);
    setError(null);

    const fetchAll = axios.get(`${import.meta.env.VITE_API_URL}/softwares/softwares`);
    const fetchMine = axios.get(`${import.meta.env.VITE_API_URL}/my-softwares/my-softwares`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    Promise.all([fetchAll, fetchMine])
      .then(([allRes, mineRes]) => {
        if (!alive) return;
        const all: typePrograms[] = allRes.data || [];
        const mine: MySoftware[] = mineRes.data || [];

        setAllPrograms(all);

        const bought = new Set<number>(
          (mine || [])
            .map((m) => Number(m.idsoftwares_para_comprar))
            .filter((n) => !Number.isNaN(n))
        );
        setPurchasedIds(Array.from(bought));
      })
      .catch((err) => {
        console.error(err);
        if (!alive) return;
        setError('Ocorreu um erro ao carregar os softwares. Tente novamente.');
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  // apenas NÃO comprados
  const notPurchased = useMemo(
    () => allPrograms.filter((p) => !purchasedIds.includes(Number(p.id))),
    [allPrograms, purchasedIds]
  );

  // busca simples por nome/descrição (opcional)
  const programas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notPurchased;
    return notPurchased.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [notPurchased, query]);

  // identidade e medidas fixas (mesmo visual do arquivo inicial)
  const brand = { primary: '#141556', hover: '#00A9C4' };
  const CARD_W = 239; // 205 img + 16 + 16 padding + 1 + 1 borda
  const IMG_W = 205;
  const IMG_H = 200;

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
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Lista de Softwares
      </Typography>

      {/* barra de busca sem Grid */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          label="Pesquisar programa"
          variant="outlined"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flex: '1 1 320px' }}
        />
        <Button
          onClick={() => setQuery((v) => v)} // placeholder pra manter o botão (caso queira acionar outra lógica)
          sx={{
            flex: '0 0 200px',
            backgroundColor: brand.primary,
            color: '#fff',
            '&:hover': { backgroundColor: brand.hover },
          }}
        >
          Pesquisar
        </Button>
      </Box>

      {/* estados */}
      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <CircularProgress size={20} />
          <Typography>Carregando softwares…</Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && programas.length === 0 && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          Nenhum software disponível para compra no momento.
        </Typography>
      )}

      {/* lista (CSS Grid fixo 239px) */}
      {!loading && !error && programas.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: 'repeat(auto-fill, 239px)',
            justifyContent: { xs: 'center', md: 'flex-start' },
          }}
        >
          {programas.map((programs) => (
            <Card
              key={programs.id}
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
                image={programs.image}
                alt={programs.description || programs.name}
                loading="lazy"
              />
              <Typography variant="h6" sx={{ width: 200, height: 60, textAlign: 'center' }}>
                {programs.name}
              </Typography>

              <Button
                href={`./pagamento?id=${programs.id}`}
                variant="contained"
                sx={{ backgroundColor: brand.primary, '&:hover': { backgroundColor: brand.hover } }}
              >
                Comprar por R$ {programs.price}
              </Button>
            </Card>
          ))}
        </Box>
      )}

      {/* skeletons */}
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
