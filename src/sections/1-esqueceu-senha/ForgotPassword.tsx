import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import axios from 'axios';
import { StatusDialog } from 'src/components/feedback/StatusDialog';
import { useRouter } from 'src/routes/hooks';

type Severity = 'success' | 'error' | 'warning' | 'info';

export function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [btnDisabled, setBtnDisabled] = useState(false);

  // Dialog padrão do seu projeto
  const [dialog, setDialog] = useState<{
    open: boolean;
    severity: Severity;
    title?: string;
    message: string;
    primaryAction?: { label: string; onClick?: () => void };
  }>({
    open: false,
    severity: 'info',
    message: '',
  });

  const openDialog = (config: Partial<typeof dialog>) =>
    setDialog((d) => ({ ...d, open: true, ...config }));
  const closeDialog = () => setDialog((d) => ({ ...d, open: false }));

  // cooldown simples de reenvio
  useEffect(() => {
    if (!cooldown) return;
    const id = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const isValidEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase());

  const goToLogin = useCallback(() => router.push('/sign-in'), [router]);

  const handleSend = async () => {
    if (!email.trim()) {
      openDialog({
        severity: 'error',
        title: 'E-mail obrigatório',
        message: 'Digite seu e-mail para enviarmos o código.',
      });
      return;
    }
    if (!isValidEmail(email)) {
      openDialog({
        severity: 'error',
        title: 'E-mail inválido',
        message: 'Verifique o formato do e-mail e tente novamente.',
      });
      return;
    }

    try {
      setSending(true);
      setBtnDisabled(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/password/forgot`,
        { email },
        { validateStatus: () => true }
      );

      if (res.data?.error) {
        setBtnDisabled(false);
        setSending(false);
        openDialog({
          severity: 'error',
          title: 'Não foi possível enviar',
          message: String(res.data.error),
        });
        return;
      }

      // sucesso
      sessionStorage.setItem('resetEmail', email);
      setCooldown(60);
      setSending(false);
      setBtnDisabled(false);
      openDialog({
        severity: 'success',
        title: 'Código enviado!',
        message:
          'Enviamos um código para seu e-mail. Abra sua caixa de entrada e prossiga para definir uma nova senha.',
        primaryAction: {
          label: 'Inserir código',
          onClick: () => {
            closeDialog();
            router.push(`/alterar-senha`);
          },
        },
      });
    } catch {
      setBtnDisabled(false);
      setSending(false);
      openDialog({
        severity: 'error',
        title: 'Falha de conexão',
        message: 'Verifique sua internet e tente novamente.',
      });
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || sending) return;
    await handleSend();
  };

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">Redefinir senha</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          Informe seu e-mail para enviarmos um código de verificação.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <TextField
          fullWidth
          type="email"
          label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
          slotProps={{ inputLabel: { shrink: true } }}
          autoComplete="email"
        />

        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={handleSend}
          disabled={btnDisabled || sending}
          sx={{
            mb: 1.5,
            backgroundColor: '#00A9C4',
            '&:hover': { backgroundColor: '#001F3F' },
          }}
        >
          {sending ? 'Enviando…' : 'Enviar'}
        </Button>

        <Link component="button" variant="body2" onClick={goToLogin} sx={{ color: 'rgb(28, 37, 46)' }}>
          Voltar para o login
        </Link>
      </Box>

      <StatusDialog
        open={dialog.open}
        onClose={closeDialog}
        severity={dialog.severity}
        title={dialog.title}
        message={dialog.message}
        primaryAction={dialog.primaryAction}
      />
    </>
  );
}

export default ForgotPassword;
