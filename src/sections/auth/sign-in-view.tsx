import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import axios from 'axios'

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false)

  // const handleSignIn = useCallback(() => {
  //   router.push('/');
  // }, [router]);

  const handleSignIn = async () => {
    setBtnDisabled(true)
    const response = await axios.post('https://softhive-backend.onrender.com/login/login', {
      email, 
      senha: password
    }, {
      validateStatus: () => true,
    })

    if(response.data.error) {
      setBtnDisabled(false)
      return alert('Email ou senha inválidos')
    }

    if(response.data.token) {
      setBtnDisabled(false)
      localStorage.setItem('token', response.data.token)

      const softwareEscolhido = localStorage.getItem('softwareEscolhido')

      if(softwareEscolhido){
        return router.push(`/pagamento?id=${softwareEscolhido}`);
      }else{
        return router.push(`/softwares`);
      }

    }

  }

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
        label="Endereço de email"
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        onChange={(ev) => setEmail(ev.target.value)}
        value={email}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Esqueceu a senha?
      </Link>

      <TextField
        fullWidth
        name="Senha"
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
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
        sx={{
          marginBottom: 1
        }}
        disabled={btnDisabled}
      >
        Fazer Login
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
          border: 'solid 1px #000',
          color: '#000'
        }}
      >
        Se Registrar
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
      
      
    </>
  );
}
