import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { CircularProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ----------------------------------------------------------------------

export function CreatePassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);

  useEffect(() => {
    // const searchParams = new URLSearchParams(window.location.search);
    // const emailFromUrl = searchParams.get('email');
    const emailFromLocalstorage = localStorage.getItem('email')
    if (emailFromLocalstorage) {
      setEmail(emailFromLocalstorage);
    } else {
      // Opcional: Redirecionar se não houver e-mail
      window.location.href = './';
    }
  }, []);

  const handleSetPassword = async () => {
    if (!password || !confirmPassword) {
      setError('Por favor, preencha os dois campos de senha.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        return;
    }

    setError('');
    setBtnDisabled(true);

    try {
      // const emailFromLocalstorage = localStorage.getItem('email')
      const token = localStorage.getItem('token')
      // Substitua pela URL da sua API
      await axios.post(`${import.meta.env.VITE_API_URL}/updatePasswordByEmail/update-password`, {
        email,
        senha: password,
        senhaAtual: "123456789"
      }, {headers: {
        "Authorization": `Bearer ${token}`
      }});

      // Após sucesso, redireciona para o login
      window.location.href = '/my-softwares';

    } catch (err) {
      console.error(err);
      setError('Não foi possível definir sua senha. Tente novamente.');
      setBtnDisabled(false);
    }
  };

  const renderForm = (
    <Box>
      <TextField
        fullWidth
        name="email"
        type="email"
        label="Email"
        value={email}
        disabled // Campo de e-mail bloqueado
        sx={{ mb: 3 }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        fullWidth
        name="password"
        label="Crie sua Senha"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />
      
      <TextField
        fullWidth
        name="confirmPassword"
        label="Confirme sua Senha"
        type={showConfirmPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(ev) => setConfirmPassword(ev.target.value)}
        error={!!error}
        helperText={error}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSetPassword}
        sx={{
          backgroundColor: '#00A9C4',
          "&:hover": {
            backgroundColor: "#001F3F",
          }
        }}
        disabled={btnDisabled || !email}
      >
        {btnDisabled ? <CircularProgress size={24} color="inherit" /> : 'Definir Senha e Acessar'}
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
        <Typography variant="h5">Crie sua Senha de Acesso</Typography>
        <Typography color="text.secondary">
          Para acessar seus produtos, defina uma senha para sua conta.
        </Typography>
      </Box>

      {renderForm}
    </>
  );
}

export default CreatePassword;