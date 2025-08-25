import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
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

export function SignInView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

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

  const handleSignIn = async () => {
    // validações rápidas sem travar o botão
    if (!email.trim()) {
      openDialog({
        severity: 'warning',
        title: 'E-mail obrigatório',
        message: 'Digite seu e-mail para entrar.',
      });
      return;
    }
    if (!password) {
      openDialog({
        severity: 'warning',
        title: 'Senha obrigatória',
        message: 'Digite sua senha para continuar.',
      });
      return;
    }

    try {
      setBtnDisabled(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login/login`,
        { email, senha: password },
        { validateStatus: () => true }
      );

      if (response.data?.error) {
        setBtnDisabled(false);
        openDialog({
          severity: 'error',
          title: 'Não foi possível entrar',
          message: 'E-mail ou senha inválidos. Confira os dados e tente novamente.',
        });
        return;
      }

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', response.data.email)
        setBtnDisabled(false);

        const softwareEscolhido = localStorage.getItem('softwareEscolhido');

        if (softwareEscolhido) {
          router.push(`/pagamento?id=${softwareEscolhido}`);
        } else {
          router.push(`/softwares`);
        }
        return;
      }

      // Caso inesperado
      setBtnDisabled(false);
      openDialog({
        severity: 'error',
        title: 'Erro inesperado',
        message: 'Não conseguimos validar seu login. Tente novamente em instantes.',
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

  useEffect(() => {
    const token = localStorage.getItem('token')

    if(token){
      window.location.href =  './my-softwares'
    }
  })

  const handleRegister = useCallback(() => {
    router.push('/register');
  }, [router]);

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

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }} href="./esqueci-senha">
        Esqueceu sua senha?
      </Link>

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
        autoComplete="current-password"
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
        sx={{
          marginBottom: 1,
          backgroundColor: '#00A9C4',
          "&:hover": {
          backgroundColor: "#001F3F",
        }
        }}
        disabled={btnDisabled}
      >
        Entrar
      </Button>


       <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleRegister}
        sx={{
          backgroundColor: '#fff',
          border: 'solid 1px #001F3F',
          color: '#001F3F',
          "&:hover": {
          backgroundColor: "#001F3F",}
        }}
      >
        Criar uma nova conta

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
        <Typography variant="h5">Fazer Login</Typography>
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
