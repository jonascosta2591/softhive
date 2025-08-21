import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import axios from 'axios'

// ----------------------------------------------------------------------

export function Register() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false)

  const handleSignIn = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  // const handleRegister = useCallback(() => {
  //   router.push('/register');
  // }, [router]);

  const handleRegister = async () => {
    setBtnDisabled(true)
    if(confirmPassword != password) return alert('As senhas não são iguais!')

    if(email.length === 0) return alert('Digite seu email')

    if(password.length === 0) return alert('Digite sua senha')

    if(password.length < 7) return alert('Sua senha deve ter mais que 7 caracteres')
      
    const response = await axios.post('https://softhive-backend.onrender.com/registrar/registrar', {
      email, 
      senha: password
    }, {
      validateStatus: () => true
    })

    if(response.data.error) {
      setBtnDisabled(false)
      return alert('Erro ao se registrar!, alguem ja se cadastrou com esse email!')
    }

    if(response.data.msg) {
      alert("Usuário registrado com sucesso, vamos redirecionar você para o login!")
      setBtnDisabled(false)
      return router.push(`/sign-in`);
    }
  }



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

      <TextField
        fullWidth
        name="ConfirmPass"
        label="Confirma Senha"
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
      />


      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleRegister}
        sx={{
          marginBottom: 1
        }}
        disabled={btnDisabled}
      >
        Se Registrar
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
          border: 'solid 1px #000',
          color: '#000'
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
      
      
    </>
  );
}
