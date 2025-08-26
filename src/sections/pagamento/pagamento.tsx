import React, { useRef, useMemo, useState, useEffect } from 'react';
import {
  Box,
  Card,
  Alert,
  Stack,
  AppBar,
  Button,
  Dialog,
  Divider,
  Toolbar,
  Checkbox,
  Container,
  TextField,
  CardMedia,
  IconButton,
  Typography,
  CardContent,
  CssBaseline,
  DialogTitle,
  createTheme,
  GlobalStyles,
  DialogActions,
  DialogContent,
  ThemeProvider, // Adicionado para o ícone de olho
  CircularProgress
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

// Ícone de erro para o balão de fala

// Substituindo os ícones de 'react-icons' por ícones do Material-UI para resolver o erro.
import { CreditCard } from '@mui/icons-material';
import axios from 'axios'

// ===================== THEME =====================
// Definindo o tema com base nas variáveis CSS do arquivo HTML
const theme = createTheme({
  typography: {
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif',
  },
  palette: {
    mode: 'dark',
    primary: { main: '#00C2E6' },
    success: { main: '#28a745' },
    warning: { main: '#ffc107' },
    error: { main: '#dc3545' },
    background: {
      default: '#000814',
      paper: 'rgba(255,255,255,0.05)',
    },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // Ajusta a largura total para ficar mais parecido com a versão HTML
          width: '100%',
          '& .MuiInputBase-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

// ===================== UTILITIES =====================
const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
};

const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const formatCEP = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const formatPhoneBR = (value: string) => {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) {
    // (99) 9999-9999
    const p1 = d.slice(0, 2);
    const p2 = d.slice(2, 6);
    const p3 = d.slice(6, 10);
    return d.length <= 2 ? `(${p1}` :
      d.length <= 6 ? `(${p1}) ${p2}` :
        `(${p1}) ${p2}-${p3}`;
  }
  // (99) 99999-9999
  const p1 = d.slice(0, 2);
  const p2 = d.slice(2, 7);
  const p3 = d.slice(7, 11);
  return `(${p1}) ${p2}-${p3}`;
};


const currency = (n: number) => `R$ ${n.toFixed(2)}`;

// ===================== TYPES & DATA =====================
type Product = {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  image: string; // data URI
};

// const AVAILABLE_PRODUCTS: Product[] = [
//   {
//     id: 'office',
//     name: 'Microsoft Office',
//     category: 'Produtividade',
//     description: 'Suite completa com Word, Excel, PowerPoint e mais',
//     price: 89.0,
//     image:
//       "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23D83B01'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EMS%3C/text%3E%3C/svg%3E",
//   },
//   {
//     id: 'autocad',
//     name: 'AutoCAD',
//     category: 'Design e Engenharia',
//     description: 'Software profissional para desenho técnico e projetos',
//     price: 129.0,
//     image:
//       "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E51937'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='12' font-weight='bold'%3ECAD%3C/text%3E%3C/svg%3E",
//   },
//   {
//     id: 'premiere',
//     name: 'Adobe Premiere Pro',
//     category: 'Edição de vídeo',
//     description: 'Editor de vídeo profissional para criação de conteúdo',
//     price: 79.0,
//     image:
//       "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%239999FF'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EPr%3C/text%3E%3C/svg%3E",
//   },
//   {
//     id: 'illustrator',
//     name: 'Adobe Illustrator',
//     category: 'Design gráfico',
//     description: 'Criação de ilustrações e gráficos vetoriais',
//     price: 59.0,
//     image:
//       "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23FF9A00'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EAi%3C/text%3E%3C/svg%3E",
//   },
//   {
//     id: 'coreldraw',
//     name: 'CorelDRAW',
//     category: 'Design gráfico',
//     description: 'Suite completa para design gráfico e ilustração',
//     price: 69.0,
//     image:
//       "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23239B56'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='12' font-weight='bold'%3ECDR%3C/text%3E%3C/svg%3E",
//   },
//   {
//     id: 'aftereffects',
//     name: 'Adobe After Effects',
//     category: 'Motion Graphics',
//     description: 'Criação de efeitos visuais e animações',
//     price: 99.0,
//     image:
//       "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%239999FF'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EAe%3C/text%3E%3C/svg%3E",
//   },
// ];

// ===================== SMALL COMPONENTS =====================
const PaymentMethodCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}> = ({ icon, label, selected, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      p: 2,
      borderRadius: 1,
      border: '1px solid',
      borderColor: selected ? 'primary.main' : 'rgba(255,255,255,0.08)',
      bgcolor: selected ? 'rgba(0,194,230,0.15)' : 'rgba(255,255,255,0.02)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      gap: 1,
      minHeight: 60,
      transition: 'all .3s ease',
      '&:hover': { borderColor: 'primary.main' },
    }}
  >
    <Box sx={{ fontSize: 24, display: 'flex', alignItems: 'center' }}>
      {icon}
    </Box>
    <Typography>{label}</Typography>
  </Box>
);

// const INITIAL_CART: Product[] = [
//   {
//     id: 'photoshop',
//     name: 'Adobe Photoshop',
//     category: 'Editor de imagens',
//     price: 49.0,
//     image:
//       "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23001F3F'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%2300C2E6' font-family='Arial' font-size='14' font-weight='bold'%3EPS%3C/text%3E%3C/svg%3E",
//   },
// ];

const Pagamento: React.FC = () => {
  const [method, setMethod] = useState<'credit' | 'pix'>('pix');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Novo estado para visibilidade da senha
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Novo estado para visibilidade da confirmação de senha
  const [passwordsMatchError, setPasswordsMatchError] = useState(false); // Novo estado para o erro de senhas

  const [btnDisabled, setBtnDisabled] = useState<boolean>(false)
  const [imagemPixQrCode, setImagemPixQrCode] = useState<string>('')
  const [codigoCopiaEcolaPix, setCodigoCopiaEcolaPix] = useState<string>('')
  const [textButtonCopiaEcola, setTextButtonCopiaECola] = useState<string>('Pagar com código copia e cola')
  const [transactionId, setTransactionId] = useState<string>('')

  const [statusPayment, setStatusPayment] = useState<string>('')

  const [promo, setPromo] = useState('');
  const [cart, setCart] = useState<Product[]>([]);

  const [avaliableProducts, setAvaliableProducts] = useState<Product[]>([])
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const cardNumberRef = useRef<HTMLInputElement>(null);
  const cardExpiryRef = useRef<HTMLInputElement>(null);
  const cardCVVRef = useRef<HTMLInputElement>(null);

  // Price summary
  const subtotal = useMemo(() => cart.reduce((t, p) => t + p.price, 0), [cart]);
  const discount = 0;
  const taxes = 0;
  const total = subtotal - discount + taxes;

  // Price pulse animation
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 250);
    return () => clearTimeout(t);
  }, [total, subtotal]);

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      window.location.href = "./sign-in"
    }
  }, [])

  // Handlers para o toggle de visibilidade
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handler para a validação de senhas ao sair do campo
  const handleConfirmPasswordBlur = () => {
    setPasswordsMatchError(password !== confirmPassword);
  };

  const handleSubmitPayment = async () => {
    if (firstName.length === 0) return alert('Digite seu nome')
    if (lastName.length === 0) return alert('Digite seu sobrenome')
    if (cpf.length === 0) return alert('Digite seu CPF')

    if (method === 'pix') {
      const IdsSoftwaresEscolhidos = cart.map((c: Product) => c.id)
      const AuthorizationToken = localStorage.getItem('token')
      setBtnDisabled(true)
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/comprar_software/comprar`, {
          softwaresIds: IdsSoftwaresEscolhidos,
          paymentMethod: "PIX",
          paymentUserData: [
            { name: firstName + ' ' + lastName, cpfCnpj: cpf }
          ]
        }, {

          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthorizationToken
          }
        })

        if (response.data) {
          setTransactionId(response.data.idTransaction)
          setImagemPixQrCode(response.data.data[0].encodedImage)
          setCodigoCopiaEcolaPix(response.data.data[0].payload)

          //verifica se o pix foi pago, se sim redireciona para página "Meus softwares"
          setInterval(async () => {
            try {
              const responseVerifyTransaction = await axios.get(`${import.meta.env.VITE_API_URL}/payment/payment?paymentId=${response.data.idTransaction}`, {
                headers: {
                  'Authorization': `Bearer ${AuthorizationToken}`
                }
              })
              if (responseVerifyTransaction.data.status !== 'PENDING') {
                window.location.href = './my-softwares'
              }

            } catch (err) {
              console.log(err)
            }
          }, 3000)
        }
      } catch {
        alert('Ocorreu um erro com a comunicação do servidor, por favor tente novamente')
        setBtnDisabled(false)
        location.reload()
      }


    }
    if (method === 'credit') {
      const IdsSoftwaresEscolhidos = cart.map((c: Product) => c.id)
      const AuthorizationToken = localStorage.getItem('token')
      setBtnDisabled(true)

      try{
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/comprar_software/comprar`, {
          "softwaresIds": IdsSoftwaresEscolhidos, 
          "paymentMethod": "Credit Card", 
          "paymentUserData": [{
            "holderName": cardName, 
            "number": cardNumber, 
            "expiryMonth": cardExpiry.split('/')[0], 
            "expiryYear": cardExpiry.split('/')[1], 
            "ccv": cardCVV, 
            "name": firstName + " " + lastName, 
            "email": localStorage.getItem('email'), 
            "cpfCnpj": cpf, 
            "postalCode": cep, 
            addressNumber, 
            phone, 
            address, 
            "province": district
          }]}, {
            headers: {
              'Authorization': `Bearer ${AuthorizationToken}`
            }
          })
          const idTransaction = response.data.idTransaction

          const verifyTransaction = setInterval(async () => {
            try {
              const responseVerifyTransaction = await axios.get(`${import.meta.env.VITE_API_URL}/payment/payment?paymentId=${idTransaction}`, {
                headers: {
                  'Authorization': `Bearer ${AuthorizationToken}`
                }
              })
              if (responseVerifyTransaction.data.status === 'PENDING'){
                //sua transação está sendo processada, por favor aguarde 15 segundos!!
                setStatusPayment('Estamos processando seu pagamento, por favor aguarde 1 minuto...')
              }else if (responseVerifyTransaction.data.status === 'REFUSED' || responseVerifyTransaction.data.status === 'CANCELLED' || responseVerifyTransaction.data.status === 'CHARGEBACK_REQUESTED' || responseVerifyTransaction.data.status === 'CHARGEBACK_DISPUTE'){
                setStatusPayment('Seu pagamento foi recusado! por favor tente pagar com pix ou com outro cartão!')
                setBtnDisabled(false)
                clearInterval(verifyTransaction)
              }else if (responseVerifyTransaction.data.status === 'CONFIRMED' || responseVerifyTransaction.data.status === 'RECEIVED'){
                alert('Seu pagamento foi aprovado!, vamos redirecionar você para a página do seu software!')
                window.location.href = './my-softwares'
              }
              console.log('aguardando pagamento ', responseVerifyTransaction.data)
            } catch (err) {
              console.log(err)
            }
          }, 3000)


          console.log(response.data)
      }catch(err){
        alert(err)
      }
    }
  }

  function HandleCopiarCopiaEcolaPix() {
    setTextButtonCopiaECola('Código Copiado')
    navigator.clipboard.writeText(codigoCopiaEcolaPix)

    setTimeout(() => {
      setTextButtonCopiaECola('Pagar com código copia e cola')
    }, 5000)
  }


  const validate = () => {
    // Sempre obrigatórios
    if (!firstName.trim()) { console.error('Por favor, insira seu nome.'); return false; }
    if (!lastName.trim()) { console.error('Por favor, insira seu sobrenome.'); return false; }
    if (cpf.replace(/\D/g, '').length !== 11) { console.error('Por favor, insira um CPF válido.'); return false; }

    if (method === 'credit') {
      const plain = cardNumber.replace(/\s/g, '');
      if (plain.length !== 16) { console.error('Por favor, insira um número de cartão válido.'); return false; }
      if (!cardName.trim()) { console.error('Por favor, insira o nome do titular do cartão.'); return false; }
      if (cardExpiry.length !== 5) { console.error('Por favor, insira a validade do cartão (MM/AA).'); return false; }
      if (cardCVV.length < 3) { console.error('Por favor, insira o CVV do cartão.'); return false; }

      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) { console.error('Por favor, insira um telefone válido.'); return false; }
      if (cep.replace(/\D/g, '').length !== 8) { console.error('Por favor, insira um CEP válido.'); return false; }
      if (!address.trim()) { console.error('Por favor, insira o endereço.'); return false; }
      if (!addressNumber.trim()) { console.error('Por favor, insira o número do endereço.'); return false; }
      if (!district.trim()) { console.error('Por favor, insira o bairro.'); return false; }
    }

    return true;
  };

  // Simple brand detection
  const cardBrand = useMemo(() => {
    const v = cardNumber.replace(/\s/g, '');
    if (v.startsWith('4')) return <CreditCard />;
    if (v.startsWith('5') || v.startsWith('2')) return <CreditCard />;
    if (v.startsWith('3')) return <CreditCard />;
    return '';
  }, [cardNumber]);

  const onSubmit: React.FormEventHandler = e => {
    e.preventDefault();

    if (method === 'pix') {
      // Não processa submit "padrão" no PIX; o botão já chama handleSubmitPayment.
      return;
    }

    if (!validate()) return;
    setSubmitting(true);


    //Envia os produtos com a cc para o backend
    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
    }, 2000);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id")

    const softwareEscolhido = localStorage.getItem('softwareEscolhido')
    if (softwareEscolhido) { //Só redireciona a primeira vez
      localStorage.removeItem('softwareEscolhido')
    }

    axios.get(`${import.meta.env.VITE_API_URL}/softwares/softwares`, { validateStatus: () => true }).then((response) => {
      const AvailableSoftwares = response.data
      setAvaliableProducts(AvailableSoftwares)

      const firstProductSelected = AvailableSoftwares.filter((resp: any) => {
        if (id === resp.id.toString()) return resp
      })

      setCart(firstProductSelected)
    })
  }, [])

  // Autofocus chain
  useEffect(() => {
    const node = cardNumberRef.current;
    const handler = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.value.replace(/\s/g, '').length === 16)
        cardExpiryRef.current?.focus();
    };
    node?.addEventListener('keyup', handler);
    return () => node?.removeEventListener('keyup', handler);
  }, []);

  useEffect(() => {
    const node = cardExpiryRef.current;
    const handler = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.value.length === 5) cardCVVRef.current?.focus();
    };
    node?.addEventListener('keyup', handler);
    return () => node?.removeEventListener('keyup', handler);
  }, []);

  useEffect(() => {
    function formatarTempo(segundos: number) {
      // const h = String(Math.floor(segundos / 3600)).padStart(2, '0');
      const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, '0');
      const s = String(segundos % 60).padStart(2, '0');
      return `${m} minutos e ${s} segundos`;
    }
    let tempo = 60 * 60;

    const contador = document.getElementById("contador");

    const intervalo = setInterval(() => {

      if (contador) {
        contador.textContent = formatarTempo(tempo);
        tempo--;

        if (tempo < 0) {
          clearInterval(intervalo);
          contador.textContent = "Pix Expirado!! Atualize a página e gere outro pix";
        }
      }

    }, 1000);
  }, [imagemPixQrCode])

  // Mobile smooth scroll
  useEffect(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    const small = window.innerWidth <= 768;
    if (!small) return;
    const focusHandler = (e: Event) => {
      const el = e.target as HTMLElement;
      setTimeout(
        () => el.scrollIntoView({ behavior: 'smooth', block: 'center' }),
        300
      );
    };
    inputs.forEach(i => i.addEventListener('focus', focusHandler));
    return () =>
      inputs.forEach(i => i.removeEventListener('focus', focusHandler));
  }, []);

  const applyPromo = () => {
    if (!promo.trim()) return;
    if (promo.toLowerCase() === 'desconto10') {
      console.log('Código promocional aplicado! Desconto de 10% concedido.');
    } else {
      console.error('Código promocional inválido.');
    }
  };

  // Modal helpers
  const openModal = () => {
    setSelected({});
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
  const confirmSelection = () => {
    const picks = avaliableProducts.filter(p => selected[p.id]);
    if (picks.length) {
      setCart(c => [...c, ...picks]);
      closeModal();
    }
  };
  const removeFromCart = (id: string) => setCart(c => c.filter(p => p.id !== id));

  function processingPaymentComponent() {
    return (
      <>
      <Typography sx={{
        color: statusPayment.includes('recusado') ? 'red' : '#fff'
      }}>{statusPayment}</Typography>
      </>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--primary-navy': '#001F3F',
            '--primary-cyan': '#00C2E6',
            '--text-primary': '#FFFFFF',
            '--text-secondary': 'rgba(255,255,255,0.7)',
            '--text-muted': 'rgba(255,255,255,0.5)',
            '--surface-primary': 'rgba(255,255,255,0.05)',
            '--surface-secondary': 'rgba(255,255,255,0.02)',
            '--border-subtle': 'rgba(255,255,255,0.08)',
            '--border-focus': 'rgba(0,194,230,0.3)',
            '--success-green': '#28a745',
            '--warning-orange': '#ffc107',
            '--danger-red': '#dc3545',
          },
          body: {
            background: 'linear-gradient(90deg, #001F3F 0%, #000814 100%)',
            minHeight: '100%',
            fontFeatureSettings: '"kern" 1, "liga" 1',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
          a: { color: 'inherit' },
          // Adicionado para desativar o fundo azul do preenchimento automático
          'input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px #00c4e623 inset !important',
            WebkitTextFillColor: 'var(--text-primary)',
            caretColor: 'var(--text-primary)',
            transition: 'background-color 5000s ease-in-out 0s',
          },
        }}
      />

      {/* HEADER */}
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          bgcolor: 'rgba(0,31,63,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0,194,230,0.2)',
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1, alignItems: 'center' }}>
            <svg width="150" height="auto" viewBox="0 0 150 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.14534 23.2916L19.2024 32.1569C19.6143 32.4003 20.0583 32.5203 20.5031 32.5203C20.952 32.5203 21.405 32.3962 21.8276 32.1536L24.0178 30.8883C24.4445 30.6417 24.7758 30.3153 24.9954 29.9346V29.9297C25.2141 29.549 25.3316 29.1001 25.3316 28.6085C25.3316 28.116 25.2141 27.6671 24.9954 27.2873V27.2823C24.7758 26.9009 24.4445 26.5745 24.0178 26.3278L12.6786 19.7809C11.895 19.3287 11.2776 18.7055 10.8558 17.9631C10.4357 17.2257 10.2154 16.3764 10.2269 15.4695C10.2367 14.5619 10.4776 13.7183 10.9142 12.9915C11.3541 12.2606 11.9879 11.6514 12.7846 11.2173L14.7932 10.1205C15.5611 9.70124 16.3816 9.49652 17.2037 9.50721C18.0292 9.51625 18.8456 9.7407 19.6028 10.1781L19.602 10.1797L35.2329 19.2038V13.4207C35.2329 12.9414 35.1203 12.5015 34.909 12.1241C34.6969 11.746 34.3803 11.4212 33.9734 11.1721L20.1306 2.73917C19.6982 2.47608 19.2287 2.34371 18.7625 2.34371C18.2947 2.34371 17.8253 2.47608 17.3928 2.73917L3.55009 11.1721C3.1423 11.4204 2.82659 11.746 2.61447 12.1241C2.40318 12.5015 2.29054 12.9414 2.29054 13.4207V19.7818V20.0416C2.29054 21.4154 2.96471 22.5952 4.14863 23.2924L4.14534 23.2916ZM18.9031 15.1415L24.6476 18.4581C25.1746 18.7623 25.3555 19.4381 25.0529 19.9651L25.02 20.0235C24.8687 20.2866 24.6426 20.4609 24.3491 20.539C24.054 20.6187 23.7736 20.5817 23.5089 20.4288L17.7653 17.1122C17.2383 16.808 17.0566 16.1322 17.3599 15.6052L17.3928 15.5476C17.5441 15.2837 17.7686 15.1094 18.0637 15.0313C18.3572 14.9516 18.6392 14.9886 18.9023 15.1415H18.9031ZM35.2313 21.8322L18.4633 12.1513H18.4583C18.044 11.9112 17.6074 11.7887 17.1758 11.7838C16.7425 11.7788 16.3018 11.8907 15.8809 12.12L13.8723 13.2168C13.4399 13.4536 13.0995 13.7775 12.8685 14.1615C12.6358 14.5487 12.5084 15.0034 12.5018 15.4967C12.496 15.9899 12.6128 16.4462 12.8364 16.8392C13.0584 17.2273 13.3905 17.5603 13.8205 17.8077L25.1598 24.3546C25.931 24.8011 26.5427 25.4136 26.9653 26.1453L26.9677 26.1436C27.3911 26.877 27.6164 27.7156 27.6164 28.6093C27.6164 29.5022 27.3911 30.34 26.9677 31.0733L26.9653 31.0725C26.5427 31.8034 25.931 32.4167 25.1598 32.8623L22.9695 34.126C22.1877 34.5782 21.345 34.8059 20.5022 34.8059C19.6636 34.8059 18.8259 34.5798 18.0497 34.1211L1.85726 24.5824C0.674172 23.8843 0 22.7054 0 21.3324V13.4199C0 12.5459 0.214584 11.727 0.619088 11.0077C1.02195 10.2907 1.60979 9.68151 2.35878 9.22603L16.2015 0.792296C17.0056 0.302287 17.8812 0.0581055 18.7584 0.0581055C19.6357 0.0581055 20.5105 0.30311 21.3145 0.792296L35.1573 9.22603C35.9063 9.68151 36.4941 10.2907 36.8978 11.0077C37.3015 11.7279 37.5161 12.5459 37.5161 13.4199V30.6433C37.5161 31.5181 37.3015 32.337 36.8978 33.0556C36.4941 33.7725 35.9063 34.3817 35.1573 34.838L21.3145 43.2717C20.5105 43.7617 19.6349 44.0051 18.7584 44.0051C17.8812 44.0051 17.0056 43.7609 16.2015 43.2717L2.35878 34.838C1.60979 34.3817 1.02195 33.7725 0.619088 33.0556C0.214584 32.337 0 31.5181 0 30.6433V27.1845C0 26.5555 0.513851 26.0417 1.1428 26.0417C1.77176 26.0417 2.28561 26.5555 2.28561 27.1845V30.6433C2.28561 31.1235 2.39825 31.5633 2.60954 31.9399C2.82166 32.3189 3.13819 32.6437 3.54516 32.8919L17.3879 41.3257C17.8204 41.5888 18.2898 41.7203 18.7576 41.7203C19.2246 41.7203 19.6932 41.5888 20.1257 41.3257L33.9684 32.8919C34.3762 32.6445 34.6919 32.3189 34.904 31.9399C35.1153 31.5642 35.228 31.1243 35.228 30.6433V21.8322H35.2313Z" fill="white" />
              <path d="M51.7724 32.2621C50.7957 32.2621 49.865 32.133 48.9804 31.8748C48.0957 31.6167 47.3032 31.2303 46.6027 30.7139C45.9022 30.1976 45.3357 29.5383 44.9025 28.7366C44.4692 27.9359 44.225 26.9904 44.1699 25.9035H46.6027C46.6948 26.8983 46.9809 27.704 47.4602 28.3223C47.9387 28.9397 48.5611 29.3903 49.3257 29.6772C50.0911 29.9625 50.9158 30.1047 51.8004 30.1047C52.63 30.1047 53.3946 29.9855 54.0951 29.7454C54.7955 29.5062 55.3538 29.1239 55.7673 28.5985C56.1825 28.0732 56.3897 27.3957 56.3897 26.567C56.3897 25.8484 56.1817 25.212 55.7673 24.6587C55.353 24.1062 54.5933 23.728 53.4867 23.5258L49.6159 22.8072C48.215 22.5482 47.082 21.9727 46.2155 21.079C45.3497 20.1845 44.9164 19.1026 44.9164 17.8299C44.9164 16.6509 45.2248 15.6462 45.8422 14.8166C46.4605 13.9879 47.2802 13.3515 48.3029 12.9092C49.3257 12.4669 50.4274 12.2457 51.6072 12.2457C52.8602 12.2457 53.9849 12.462 54.9797 12.8952C55.9745 13.3277 56.7802 13.9739 57.3985 14.8298C58.0159 15.6873 58.3802 16.7512 58.4895 18.0231H56.0296C55.9375 17.1746 55.6933 16.4881 55.2971 15.9635C54.9008 15.4382 54.3886 15.046 53.7621 14.7879C53.1356 14.5297 52.4261 14.4006 51.6335 14.4006C50.8599 14.4006 50.1503 14.5207 49.5058 14.7599C48.8612 15 48.335 15.3593 47.9297 15.8386C47.5243 16.3179 47.3213 16.9263 47.3213 17.6638C47.3213 18.4193 47.5975 19.0508 48.1508 19.5572C48.7033 20.0645 49.4408 20.4098 50.3616 20.594L54.0104 21.2574C55.5774 21.5526 56.7704 22.1429 57.5909 23.0267C58.4114 23.9114 58.8208 25.0542 58.8208 26.4551C58.8208 27.45 58.6227 28.3075 58.2264 29.0269C57.8301 29.7446 57.3007 30.3448 56.6372 30.8233C55.9737 31.3026 55.2222 31.6619 54.3836 31.902C53.5458 32.1412 52.6744 32.2613 51.7716 32.2613L51.7724 32.2621ZM67.5908 32.2621C66.2466 32.2621 65.0388 31.9628 63.9692 31.3643C62.9004 30.7649 62.0618 29.9263 61.4542 28.8485C60.8458 27.7698 60.5416 26.5127 60.5416 25.0747C60.5416 23.6187 60.8516 22.3567 61.4682 21.287C62.0856 20.2182 62.9325 19.3846 64.0111 18.786C65.0898 18.1867 66.3017 17.8866 67.6459 17.8866C68.991 17.8866 70.1979 18.1858 71.2675 18.786C72.3364 19.3846 73.175 20.2182 73.7834 21.287C74.3918 22.3558 74.6951 23.6187 74.6951 25.0747C74.6951 26.5127 74.3868 27.7698 73.7694 28.8485C73.1511 29.9271 72.3084 30.7649 71.2396 31.3643C70.1708 31.9628 68.9548 32.2621 67.5908 32.2621ZM67.5908 30.1335C68.4196 30.1335 69.1801 29.9452 69.8715 29.567C70.5629 29.1888 71.1154 28.6224 71.5298 27.8668C71.945 27.1112 72.1514 26.1805 72.1514 25.0747C72.1514 23.95 71.9442 23.0152 71.5298 22.2687C71.1146 21.5222 70.5671 20.9606 69.8847 20.5824C69.2031 20.2043 68.4557 20.016 67.6459 20.016C66.8344 20.016 66.0846 20.2092 65.3932 20.5964C64.7018 20.9837 64.1452 21.5452 63.7209 22.2827C63.2967 23.0202 63.0854 23.9508 63.0854 25.0747C63.0854 26.1805 63.2926 27.1112 63.7069 27.8668C64.1221 28.6224 64.6697 29.1888 65.3521 29.567C66.0337 29.9452 66.7794 30.1335 67.5908 30.1335ZM78.2115 31.9307V15.8131C78.2115 14.7994 78.3406 14.0208 78.5988 13.4773C78.8569 12.9339 79.2762 12.5557 79.8575 12.3436C80.4379 12.1323 81.2075 12.0254 82.1653 12.0254H83.6575V14.154H82.6076C81.8331 14.154 81.3218 14.2691 81.0726 14.4993C80.8243 14.7295 80.6994 15.2318 80.6994 16.0063V31.9299H78.2107L78.2115 31.9307ZM76.1931 20.3194V18.2179H83.6575V20.3194H76.1931ZM91.1277 31.9307C90.3532 31.9307 89.6988 31.8337 89.1644 31.6405C88.6299 31.4465 88.2296 31.0823 87.9624 30.5487C87.6951 30.0143 87.5611 29.2587 87.5611 28.282V20.3194H85.1834V18.2179H87.5611V14.8734H90.0498V18.2179H93.9206V20.3194H90.0498V27.8948C90.0498 28.4842 90.0959 28.9175 90.1871 29.1938C90.2792 29.47 90.4732 29.641 90.7684 29.706C91.0635 29.7701 91.487 29.8022 92.0394 29.8022H93.7257V31.9307H91.1277Z" fill="white" />
              <path d="M110.959 31.93V12.5779H114.276V31.93H110.959ZM98.7109 31.93V12.5779H102.029V31.93H98.7109ZM101.531 23.4149V20.7058H111.567V23.4149H101.531ZM116.941 31.93V18.218H120.259V31.93H116.941ZM116.941 15.8682V12.4678H120.285V15.8682H116.941ZM127.015 31.93L121.957 18.218H125.411L129.034 28.7786L132.628 18.218H136.083L130.996 31.93H127.015ZM143.199 32.2613C141.817 32.2613 140.596 31.962 139.536 31.3635C138.476 30.7642 137.648 29.9305 137.048 28.8617C136.449 27.7929 136.15 26.558 136.15 25.157C136.15 23.738 136.445 22.4801 137.034 21.3833C137.625 20.2865 138.453 19.4298 139.523 18.8116C140.592 18.1941 141.827 17.8858 143.228 17.8858C144.573 17.8858 145.757 18.181 146.78 18.7713C147.803 19.3608 148.596 20.1575 149.158 21.163C149.719 22.1676 150.001 23.2956 150.001 24.5494C150.001 24.7336 150.001 24.9359 150.001 25.1578C150.001 25.379 149.983 25.6182 149.946 25.8764H138.556V23.7199H146.656C146.601 22.7621 146.251 22.0016 145.605 21.4392C144.961 20.8768 144.167 20.5957 143.228 20.5957C142.546 20.5957 141.915 20.7478 141.334 21.052C140.753 21.3562 140.288 21.8075 139.938 22.4069C139.588 23.0054 139.413 23.7659 139.413 24.6876V25.49C139.413 26.3376 139.584 27.0653 139.925 27.6737C140.266 28.2829 140.723 28.7425 141.293 29.0557C141.865 29.3698 142.5 29.526 143.201 29.526C143.956 29.526 144.592 29.3558 145.109 29.0146C145.624 28.6734 146.002 28.2171 146.242 27.6465H149.615C149.375 28.5312 148.956 29.3188 148.356 30.0102C147.758 30.7017 147.024 31.2492 146.159 31.6554C145.292 32.0607 144.306 32.2638 143.2 32.2638L143.199 32.2613Z" fill="#00A9C4" />
            </svg>
          </Box>

          <a href="./"><Button
            color="inherit"
            startIcon={<ArrowBackIcon />}
            sx={{ color: 'var(--text-secondary)' }}
          >
            Voltar
          </Button></a>
        </Toolbar>
      </AppBar>

      {/* MAIN */}
      <Box component="main" sx={{ mt: 10, py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          {/* Main content grid: replicate HTML grid-template-columns */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr', // On mobile, just one column
                md: '1fr 400px', // On desktop, 1fr for form, 400px for summary
              },
              gap: 6,
              alignItems: 'start',
            }}
          >
            {/* LEFT: FORM */}
            <Box>
              <Card sx={{ p: { xs: 3, md: 4 } }}>
                <CardContent sx={{ p: 0 }}>
                  {/* Header */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                      Finalizar Compra
                    </Typography>
                    <Typography sx={{ color: 'var(--text-secondary)' }}>
                      Complete os dados abaixo para concluir sua compra
                    </Typography>
                  </Box>

                  {/* Success */}
                  {success && (
                    <Box sx={{ mb: 2 }}>
                      <Alert
                        icon={<CheckCircleIcon fontSize="inherit" />}
                        severity="success"
                        sx={{ bgcolor: 'var(--success-green)', color: '#fff' }}
                      >
                        Pagamento processado com sucesso!
                      </Alert>
                    </Box>
                  )}

                  <Box component="form" onSubmit={onSubmit}>
                    {/* Método de Pagamento */}
                    <Box sx={{ mb: 4 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 2 }}
                      >
                        <Typography variant="h6" fontWeight={600}>
                          Método de Pagamento
                        </Typography>
                      </Stack>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: '1fr',
                            sm: '1fr 1fr',
                            md: 'repeat(2, 1fr)',
                          },
                          gap: 2,
                        }}
                      >
                        {/* <PaymentMethodCard
                          icon={<CreditCardIcon />}
                          label="Cartão(INDISPONÍVEL)"
                          selected={method === 'credit'}
                          onClick={() => setMethod('pix')}
                        /> */}
                        <PaymentMethodCard
                          icon={<QrCode2Icon />}
                          label="PIX"
                          selected={method === 'pix'}
                          onClick={() => setMethod('pix')}
                        />
                      </Box>
                    </Box>

                    {/* Cartão de Crédito */}
                    {method === 'credit' && (
                      <>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ mb: 2 }}
                        >
                          <LockIcon fontSize="small" />
                          <Typography variant="h6" fontWeight={600}>
                            Dados do Cartão
                          </Typography>
                        </Stack>
                        <Box
                          sx={{
                            mb: 2,
                            display: 'grid',
                            gridTemplateColumns: {
                              xs: '1fr',
                              sm: '1fr 1fr',
                              md: 'repeat(2, 1fr)',
                            },
                            gap: 2,
                          }}
                        >
                          <Box sx={{ position: 'relative' }}>
                            <TextField
                              fullWidth
                              label="Número do Cartão"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={e =>
                                setCardNumber(formatCardNumber(e.target.value))
                              }
                              inputRef={cardNumberRef}
                              inputProps={{ maxLength: 19 }}
                            />
                            {cardBrand && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  right: 10,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  color: 'var(--primary-cyan)',
                                }}
                              >
                                {cardBrand}
                              </Box>
                            )}
                          </Box>
                          <TextField
                            fullWidth
                            label="Nome no Cartão"
                            placeholder="Nome como aparece no cartão"
                            value={cardName}
                            onChange={e => setCardName(e.target.value)}
                          />
                        </Box>
                        <Box
                          sx={{
                            mb: 4,
                            display: 'grid',
                            gridTemplateColumns: {
                              xs: '1fr 120px',
                              sm: '1fr 1fr',
                              md: '1fr 120px',
                            },
                            gap: 2,
                          }}
                        >
                          <TextField
                            fullWidth
                            label="Validade"
                            placeholder="MM/AA"
                            value={cardExpiry}
                            onChange={e =>
                              setCardExpiry(formatExpiry(e.target.value))
                            }
                            inputRef={cardExpiryRef}
                            inputProps={{ maxLength: 5 }}
                          />
                          <TextField
                            fullWidth
                            label="CVV"
                            placeholder="123"
                            value={cardCVV}
                            onChange={e =>
                              setCardCVV(
                                e.target.value.replace(/\D/g, '').slice(0, 4)
                              )
                            }
                            inputRef={cardCVVRef}
                            inputProps={{ maxLength: 4 }}
                          />
                        </Box>

                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: 1,
                            border: '1px solid var(--border-subtle)',
                            bgcolor: 'var(--surface-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 4,
                          }}
                        >
                          <ShieldIcon sx={{ color: 'var(--success-green)' }} />
                          <Box>
                            <Typography fontWeight={700} variant="body2">
                              Pagamento 100% seguro
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                              Seus dados são protegidos com criptografia SSL
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    )}

                    {/* PIX */}
                    {method === 'pix' && (
                      <Box sx={{ mb: 4, textAlign: 'center', p: 4 }}>
                        {/* <Box
                          sx={{
                            width: 200,
                            height: 200,
                            bgcolor: '#fff',
                            mx: 'auto',
                            mb: 2,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <QrCode2Icon sx={{ fontSize: 64, color: '#333' }} />
                        </Box> */}
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {imagemPixQrCode && (
                            <CardMedia
                              component="img"
                              image={`data:image/png;base64,${imagemPixQrCode}`}
                              alt="QRCODE PIX"
                              sx={{
                                width: 250,   // largura fixa
                                height: '100%',  // altura fixa
                                borderRadius: 1
                              }}
                            />
                          )}
                        </Box>
                        {imagemPixQrCode && (
                          <>
                            <Typography sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                              Escaneie o QR Code com seu app do banco
                            </Typography>
                            <Button onClick={HandleCopiarCopiaEcolaPix} sx={{
                              backgroundColor: '#00C2E6',
                              color: "#000"
                            }}>{textButtonCopiaEcola}</Button>

                            <Typography sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                              O código Pix expira em:
                              <Typography sx={{ color: 'var(--text-secondary)', mb: 1 }} id="contador">
                                0 minutos e 0 segundos
                              </Typography>
                            </Typography>
                          </>
                        )}
                        {imagemPixQrCode.length === 0 && (
                          <Typography sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                            Finalize sua compra para gerar o QRCODE do pix
                          </Typography>
                        )}
                      </Box>
                    )}


                    {/* Informações de Cobrança */}
                    <Box sx={{ mb: 4 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <Typography variant="h6" fontWeight={600}>
                          Informações de Cobrança
                        </Typography>
                      </Stack>

                      {method === 'credit' ? (
                        // CARTÃO: todos os campos
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: 2,
                          }}
                        >
                          <TextField
                            fullWidth
                            label="Nome"
                            placeholder="Seu nome"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                          />
                          <TextField
                            fullWidth
                            label="Sobrenome"
                            placeholder="Seu sobrenome"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                          />

                          <TextField
                            fullWidth
                            label="Telefone"
                            placeholder="(00) 00000-0000"
                            value={phone}
                            onChange={e => setPhone(formatPhoneBR(e.target.value))}
                            inputProps={{ maxLength: 15 }}
                          />
                          <TextField
                            fullWidth
                            label="CEP"
                            placeholder="00000-000"
                            value={cep}
                            onChange={e => setCep(formatCEP(e.target.value))}
                            inputProps={{ maxLength: 9 }}
                          />

                          <TextField
                            fullWidth
                            label="Endereço"
                            placeholder="Rua, avenida, etc."
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                          />
                          <TextField
                            fullWidth
                            label="Número"
                            placeholder="Nº"
                            value={addressNumber}
                            onChange={e => setAddressNumber(e.target.value.replace(/\D/g, ''))}
                            inputProps={{ inputMode: 'numeric' }}
                          />

                          <TextField
                            fullWidth
                            label="Bairro"
                            placeholder="Seu bairro"
                            value={district}
                            onChange={e => setDistrict(e.target.value)}
                          />
                          <TextField
                            fullWidth
                            label="CPF"
                            placeholder="000.000.000-00"
                            value={cpf}
                            onChange={e => setCpf(formatCPF(e.target.value))}
                            inputProps={{ maxLength: 14 }}
                          />
                        </Box>
                      ) : (
                        // PIX: só Nome, Sobrenome e CPF
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: 2,
                          }}
                        >
                          <TextField
                            fullWidth
                            label="Nome"
                            placeholder="Seu nome"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                          />
                          <TextField
                            fullWidth
                            label="Sobrenome"
                            placeholder="Seu sobrenome"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                          />
                          <TextField
                            fullWidth
                            label="CPF"
                            placeholder="000.000.000-00"
                            value={cpf}
                            onChange={e => setCpf(formatCPF(e.target.value))}
                            inputProps={{ maxLength: 14 }}
                          />
                        </Box>
                      )}
                    </Box>


                    {/* Submit */}
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={
                        submitting ? <CircularProgress size={20} /> : <CreditCardIcon />
                      }
                      fullWidth
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(135deg, var(--primary-cyan), #0099cc)',
                        boxShadow: submitting
                          ? 'none'
                          : '0 10px 30px rgba(0,194,230,0.3)',
                        '&:hover': {
                          transform: submitting ? 'none' : 'translateY(-2px)',
                        },
                      }}
                      onClick={handleSubmitPayment}
                      disabled={btnDisabled}
                    >
                      {submitting
                        ? 'Processando pagamento...'
                        : success
                          ? 'Pagamento Concluído'
                          : 'Finalizar Compra'}
                    </Button>
                    {statusPayment && (
                      processingPaymentComponent()
                    )}
                  </Box>

                  {/* Post-success download block */}
                  {success && (
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Alert
                        icon={<CheckCircleIcon fontSize="inherit" />}
                        severity="success"
                        sx={{ bgcolor: 'var(--success-green)', color: '#fff', mb: 2 }}
                      >
                        Pagamento Aprovado! Seu download será disponibilizado em instantes.
                      </Alert>
                      <Button variant="contained" startIcon={<DownloadIcon />}>
                        Fazer Download
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>

            {/* RIGHT: SUMMARY (coluna de 400px/"sticky") */}
            <Box>
              <Card
                sx={{
                  p: 3,
                  position: { md: 'sticky' },
                  top: { md: 100 },
                  width: '100%',
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Resumo do Pedido
                  </Typography>

                  {/* Product list (first item pre-filled) */}
                  {cart.map((p, idx) => (
                    <Box
                      key={p.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2,
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'var(--surface-secondary)',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0, 194, 230, 0.15)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 1,
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={600}>{p.name}</Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'var(--text-muted)' }}
                        >
                          {p.category}
                        </Typography>
                      </Box>
                      <Typography
                        fontWeight={700}
                        sx={{ color: 'var(--primary-cyan)' }}
                      >
                        {currency(p.price)}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={() => removeFromCart(p.id)}
                        sx={{ ml: 1, color: 'var(--text-muted)', '&:hover': { color: 'var(--danger-red)' } }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}

                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={openModal}
                    fullWidth
                    sx={{
                      mb: 2,
                      borderColor: 'var(--border-subtle)',
                      bgcolor: 'var(--surface-secondary)',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(0,194,230,0.15)',
                      },
                    }}
                  >
                    Adicionar mais produtos
                  </Button>

                  {/* Promo code */}
                  <Box
                    sx={{
                      mb: 2,
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: 2,
                    }}
                  >
                    <TextField
                      fullWidth
                      placeholder="Código promocional"
                      value={promo}
                      onChange={e => setPromo(e.target.value)}
                    />
                    <Button fullWidth variant="outlined" onClick={applyPromo} sx={{ height: '100%' }}>
                      Aplicar
                    </Button>
                  </Box>

                  {/* Breakdown */}
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Subtotal</Typography>
                      <Typography sx={{ transform: pulse ? 'scale(1.05)' : 'none' }}>
                        {currency(subtotal)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Desconto</Typography>
                      <Typography>{currency(0)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Impostos</Typography>
                      <Typography>{currency(0)}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" fontWeight={700} sx={{ color: 'var(--primary-cyan)' }}>
                        Total
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          color: 'var(--primary-cyan)',
                          transform: pulse ? 'scale(1.05)' : 'none',
                        }}
                      >
                        {currency(total)}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Perks */}
                  <Box sx={{ mt: 2 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 1 }}
                    >
                      <DownloadIcon sx={{ color: 'var(--primary-cyan)' }} />
                      <Typography variant="body2">
                        Download imediato após pagamento
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 1 }}
                    >
                      <ShieldIcon sx={{ color: 'var(--primary-cyan)' }} />
                      <Typography variant="body2">100% seguro</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <HeadsetMicIcon sx={{ color: 'var(--primary-cyan)' }} />
                      <Typography variant="body2">Suporte técnico incluso</Typography>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* PRODUCTS MODAL */}
      <Dialog
        open={modalOpen}
        onClose={closeModal}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            bgcolor: 'var(--surface-primary)',
            border: '1px solid var(--border-subtle)',
            backdropFilter: 'blur(20px)',
          },
        }}
        // Estilos para o overlay do modal
        slotProps={{
          backdrop: {
            sx: {
              bgcolor: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(20px)',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Adicionar Produtos
          </Typography>
          <IconButton onClick={closeModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(auto-fill, minmax(280px, 1fr))',
              },
              gap: 2,
            }}
          >
            {avaliableProducts.filter(p => !cart.find(c => c.id === p.id)).map(p => {
              const isChecked = !!selected[p.id];
              return (
                <Box
                  key={p.id}
                  onClick={() => setSelected(s => ({ ...s, [p.id]: !s[p.id] }))}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: isChecked ? 'primary.main' : 'var(--border-subtle)',
                    bgcolor: isChecked ? 'rgba(0,194,230,0.15)' : 'var(--surface-secondary)',
                    transition: 'all .3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,194,230,0.15)',
                    },
                    position: 'relative',
                    // Garante que todos os cards tenham a mesma altura
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Checkbox
                    checked={isChecked}
                    onChange={() => setSelected(s => ({ ...s, [p.id]: !s[p.id] }))}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  />
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mb: 1.5 }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 1,
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {p.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'var(--text-muted)' }}
                      >
                        {p.category}
                      </Typography>
                    </Box>
                  </Stack>
                  {p.description && (
                    <Typography
                      variant="body2"
                      sx={{ color: 'var(--text-secondary)', mb: 1 }}
                    >
                      {p.description}
                    </Typography>
                  )}
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: 'var(--primary-cyan)' }}
                  >
                    {currency(p.price)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions
          // Usando Stack para o layout responsivo
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            p: 2,
            // Adicionando padding para alinhamento e respiro
            flexDirection: { xs: 'column', sm: 'row' },
            // Em telas pequenas (xs), o layout é em coluna
            gap: { xs: 2, sm: 0 },
            // Adicionando espaçamento entre os botões em telas pequenas
            alignItems: { sm: 'center' },
            // Alinha o texto à esquerda em telas pequenas
          }}
        >
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            {Object.values(selected).filter(Boolean).length} produto
            {Object.values(selected).filter(Boolean).length !== 1 ? 's' : ''}{' '}
            selecionado
            {Object.values(selected).filter(Boolean).length !== 1 ? 's' : ''}
          </Typography>
          {/* O Box foi substituído por um Stack para alinhamento dos botões */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Button onClick={closeModal} variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              Cancelar
            </Button>
            <Button onClick={confirmSelection} variant="contained" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              Confirmar Seleção
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Pagamento;
export { Pagamento };
