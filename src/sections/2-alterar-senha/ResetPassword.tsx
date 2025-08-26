import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import axios from 'axios';
import { useRouter } from 'src/routes/hooks';
import { StatusDialog } from 'src/components/feedback/StatusDialog';
import { Iconify } from 'src/components/iconify';

type Severity = 'success' | 'error' | 'warning' | 'info';

export function ResetPassword() {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);

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

  // Captura email da query ou do sessionStorage (salvo na etapa 1)
  useEffect(() => {
    const emailToReset = localStorage.getItem('email-to-reset') || '';
    setEmail(emailToReset);
  }, []);

  // Apenas dígitos e até 6 chars
  const codeMasked = useMemo(
    () => code,
    [code]
  );

  const isValidEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase());

  const handleConfirm = async () => {
    const emailToReset = localStorage.getItem('email-to-reset')
    if (!emailToReset) {
      openDialog({
        severity: 'error',
        title: 'Erro no serivor',
        message: 'Por favor envie o codigo novamente',
      });
      return;
    }
    if (codeMasked.length !== 10) {
      openDialog({
        severity: 'error',
        title: 'Código inválido',
        message: 'O código deve ter 10 dígitos.',
      });
      return;
    }
    if (!pwd) {
      openDialog({
        severity: 'error',
        title: 'Senha obrigatória',
        message: 'Crie uma nova senha.',
      });
      return;
    }
    if (pwd.length < 8) {
      openDialog({
        severity: 'error',
        title: 'Senha muito curta',
        message: 'A nova senha deve ter pelo menos 8 caracteres.',
      });
      return;
    }
    if (pwd !== pwd2) {
      openDialog({
        severity: 'error',
        title: 'Senhas não conferem',
        message: 'A confirmação precisa ser igual à senha digitada.',
      });
      return;
    }

    try {
      setBtnDisabled(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/send-code/valida-code`,
        { email, code: codeMasked, senha: pwd },
        { validateStatus: () => true }
      );

      if (res.data.msg === 'Código invalido!') {
        setBtnDisabled(false);
        openDialog({
          severity: 'error',
          title: 'Erro de cliente',
          message: 'Não foi possível redefinir, código invalido',
        });
        return;
      }

      // sucesso
      openDialog({
        severity: 'success',
        title: 'Senha alterada!',
        message: 'Sua senha foi redefinida com sucesso. Você já pode fazer login.',
        primaryAction: {
          label: 'Ir para o login',
          onClick: () => {
            closeDialog();
            localStorage.removeItem('email-to-reset');
            router.push('/sign-in');
          },
        },
      });
      setBtnDisabled(false);
    } catch {
      setBtnDisabled(false);
      openDialog({
        severity: 'error',
        title: 'Falha de conexão',
        message: 'Verifique sua internet e tente novamente.',
      });
    }
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
        <Typography variant="h5">Definir nova senha</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          Insira o código enviado por e-mail e crie sua nova senha.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      
        <TextField
          fullWidth
          label="Código de verificação (10 dígitos)"
          value={codeMasked}
          onChange={(e) => setCode(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          name="password"
          label="Nova senha"
          type={showPassword ? 'text' : 'password'}
          sx={{ mb: 3 }}
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          autoComplete="new-password"
        />

        <TextField
          fullWidth
          name="confirmPassword"
          label="Confirmar nova senha"
          type={showPassword ? 'text' : 'password'}
          sx={{ mb: 3 }}
          value={pwd2}
          onChange={(e) => setPwd2(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          autoComplete="new-password"
        />

        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={handleConfirm}
          disabled={btnDisabled}
          sx={{
            mb: 1.5,
            backgroundColor: '#00A9C4',
            '&:hover': { backgroundColor: '#001F3F' },
          }}
        >
          Redefinir senha
        </Button>

        <Link component="button" variant="body2" onClick={() => router.push('/esqueceu-senha')} sx={{ color: 'rgb(28, 37, 46)' }}>
          Não recebeu o código? Reenviar
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

export default ResetPassword;
