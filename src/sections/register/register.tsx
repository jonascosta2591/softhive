import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';

import axios from 'axios';
import { StatusDialog } from 'src/components/feedback/StatusDialog';

type Severity = 'success' | 'error' | 'warning' | 'info';

// ----------------------------------------------------------------------

export function Register() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token')

    if(token){
      window.location.href =  './my-softwares'
    }
  })
  // Estado do modal
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

  const closeDialog = () => setDialog((d) => ({ ...d, open: false }));
  const openDialog = (config: Partial<typeof dialog>) =>
    setDialog((d) => ({ ...d, open: true, ...config }));

  const handleSignIn = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  const handleRegister = async () => {
    // Validações primeiro (não travar o botão à toa)
    if (!email.trim()) {
      openDialog({
        severity: 'error',
        title: 'E-mail obrigatório',
        message: 'Digite seu e-mail para continuar.',
      });
      return;
    }

    if (!password) {
      openDialog({
        severity: 'error',
        title: 'Senha obrigatória',
        message: 'Crie uma senha para finalizar seu cadastro.',
      });
      return;
    }

    if (password.length < 8) {
      openDialog({
        severity: 'error',
        title: 'Senha muito curta',
        message: 'Sua senha deve ter pelo menos 8 caracteres.',
      });
      return;
    }

    if (confirmPassword !== password) {
      openDialog({
        severity: 'error',
        title: 'Senhas não conferem',
        message: 'A confirmação precisa ser igual à senha digitada.',
      });
      return;
    }

    try {
      setBtnDisabled(true);

      const response = await axios.post(
        'https://softhive-backend.onrender.com/registrar/registrar',
        { email, senha: password },
        { validateStatus: () => true }
      );

      if (response.data?.error) {
        setBtnDisabled(false);
        openDialog({
          severity: 'error',
          title: 'E-mail já cadastrado',
          message:
            'Alguém já se registrou com este e-mail. Tente fazer login ou use outro e-mail.',
        });
        return;
      }

      if (response.data?.msg) {
        setBtnDisabled(false);
        openDialog({
          severity: 'success',
          title: 'Cadastro concluído!',
          message:
            'Seu usuário foi criado com sucesso. Vamos levar você para a tela de login.',
          primaryAction: {
            label: 'Ir para o login',
            onClick: () => {
              closeDialog();
              router.push('/sign-in');
            },
          },
        });
        return;
      }

      // Caso inesperado
      setBtnDisabled(false);
      openDialog({
        severity: 'error',
        title: 'Erro inesperado',
        message: 'Não conseguimos concluir seu cadastro. Tente novamente em instantes.',
      });
    } catch {
      setBtnDisabled(false);
      openDialog({
        severity: 'error',
        title: 'Falha de conexão',
        message: 'Verifique sua internet e tente novamente.',
      });
    }
  };

  const renderForm = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        name="email"
        type="email"
        label="Email"
        sx={{ mb: 3 }}
        slotProps={{ inputLabel: { shrink: true } }}
        onChange={(ev) => setEmail(ev.target.value)}
        value={email}
        autoComplete="email"
      />

      <TextField
        fullWidth
        name="password"
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
        onChange={(ev) => setPassword(ev.target.value)}
        value={password}
        autoComplete="new-password"
      />

      <TextField
        fullWidth
        name="confirmPassword"
        label="Confirmar senha"
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
        onChange={(ev) => setConfirmPassword(ev.target.value)}
        value={confirmPassword}
        autoComplete="new-password"
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleRegister}
        sx={{
          marginBottom: 1,
          backgroundColor: '#00A9C4',
          "&:hover": {
          backgroundColor: "#001F3F",
        }
        }}
        disabled={btnDisabled}
      >
        Cadastre-se
      </Button>

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
        sx={{
          backgroundColor: '#fff',
          border: 'solid 1px #001F3F',
          color: '#001F3F',
          "&:hover": {
          backgroundColor: "#001F3F",
        }
        }}
      >
        Fazer Login
      </Button>
    </Box>
  );

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
        <Typography variant="h5">Fazer Registro</Typography>
      </Box>

      {renderForm}

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
