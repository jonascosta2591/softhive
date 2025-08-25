import React, { useMemo } from 'react';
import { Fab, Tooltip } from '@mui/material';
import { styled, keyframes, useTheme } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';

const float = keyframes`
  0%, 100% { transform: translateY(0) }
  50% { transform: translateY(-3px) }
`;

const ripple = keyframes`
  0%   { transform: scale(1);   opacity: .35 }
  70%  {                       opacity: 0 }
  100% { transform: scale(1.6); opacity: 0 }
`;

const Wrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  right: theme.spacing(2.5),
  bottom: theme.spacing(2.5),
  zIndex: theme.zIndex.tooltip + 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'auto',
  '@media print': { display: 'none' },
}));

const Pulse = styled('span')(() => ({
  position: 'absolute',
  width: 64,
  height: 64,
  borderRadius: '50%',
  background: 'rgba(37, 211, 101, 0.86)', // verde WhatsApp com alpha
  animation: `${ripple} 2.2s ease-out infinite`,
  // dica: se quiser mais discreto, reduza a largura/altura para 56
}));

function buildWaLink(phone?: string, message?: string) {
  const envPhone = (import.meta.env.VITE_WHATSAPP_PHONE || '').toString();
  const phoneDigits = (phone || envPhone).replace(/\D/g, '');
  const msg = message ?? (import.meta.env.VITE_WHATSAPP_MESSAGE as string) ?? 'Olá! Preciso de ajuda.';
  return phoneDigits ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(msg)}` : '';
}

type WhatsAppFabProps = {
  phone?: string;
  message?: string;
  tooltip?: string;
  showPulse?: boolean;
  bottom?: number; // offset opcional em px
  right?: number;  // offset opcional em px
};

export default function WhatsAppFab({
  phone,
  message,
  tooltip = 'Fale com a gente no WhatsApp',
  showPulse = true,
  bottom,
  right,
}: WhatsAppFabProps) {
  const href = useMemo(() => buildWaLink(phone, message), [phone, message]);
  const theme = useTheme();

  return (
    <Wrapper sx={{ ...(bottom != null && { bottom }), ...(right != null && { right }) }}>
      {showPulse && <Pulse />}
      <Tooltip title={tooltip} placement="left">
        <Fab
          aria-label="Abrir WhatsApp"
          onClick={() => href && window.open(href, '_blank', 'noopener,noreferrer')}
          sx={{
            width: { xs: 52, sm: 60 },
            height: { xs: 52, sm: 60 },
            bgcolor: '#25D366',
            boxShadow: theme.shadows[8],
            '&:hover': { bgcolor: '#1DA851' },
            animation: `${float} 3s ease-in-out infinite`,
          }}
        >
          <Iconify icon="logos:whatsapp-icon" width={40} height={40} />

        </Fab>
      </Tooltip>
    </Wrapper>
  );
}
