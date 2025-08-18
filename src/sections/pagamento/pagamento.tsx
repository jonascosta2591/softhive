import React, { useRef, useMemo, useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  Stack,
  Alert,
  AppBar,
  Button,
  Dialog,
  Toolbar,
  Divider,
  Checkbox,
  Container,
  TextField,
  Typography,
  IconButton,
  createTheme,
  CssBaseline,
  CardContent,
  DialogTitle,
  GlobalStyles,
  ThemeProvider,
  DialogContent,
  DialogActions,
  CircularProgress
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import LockIcon from "@mui/icons-material/Lock";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { FaCcVisa, FaCcAmex, FaCcMastercard } from "react-icons/fa";

// ===================== THEME =====================
const theme = createTheme({
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif'
  },
  palette: {
    mode: "dark",
    primary: { main: "#00C2E6" },
    success: { main: "#28a745" },
    warning: { main: "#ffc107" },
    error: { main: "#dc3545" },
    background: {
      default: "#000814",
      paper: "rgba(255,255,255,0.05)"
    }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        }
      }
    }
  }
});

// ===================== UTILITIES =====================
const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
};

const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const currency = (n: number) =>
  `R$ ${n.toFixed(2).replace(".", ",")}`;

type Product = {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  image: string; // data URI
};

// ===================== DATA =====================
const AVAILABLE_PRODUCTS: Product[] = [
  {
    id: "office",
    name: "Microsoft Office",
    category: "Produtividade",
    description: "Suite completa com Word, Excel, PowerPoint e mais",
    price: 89.0,
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23D83B01'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EMS%3C/text%3E%3C/svg%3E"
  },
  {
    id: "autocad",
    name: "AutoCAD",
    category: "Design e Engenharia",
    description: "Software profissional para desenho técnico e projetos",
    price: 129.0,
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E51937'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='12' font-weight='bold'%3ECAD%3C/text%3E%3C/svg%3E"
  },
  {
    id: "premiere",
    name: "Adobe Premiere Pro",
    category: "Edição de vídeo",
    description: "Editor de vídeo profissional para criação de conteúdo",
    price: 79.0,
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%239999FF'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EPr%3C/text%3E%3C/svg%3E"
  },
  {
    id: "illustrator",
    name: "Adobe Illustrator",
    category: "Design gráfico",
    description: "Criação de ilustrações e gráficos vetoriais",
    price: 59.0,
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23FF9A00'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EAi%3C/text%3E%3C/svg%3E"
  },
  {
    id: "coreldraw",
    name: "CorelDRAW",
    category: "Design gráfico",
    description: "Suite completa para design gráfico e ilustração",
    price: 69.0,
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23239B56'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='12' font-weight='bold'%3ECDR%3C/text%3E%3C/svg%3E"
  },
  {
    id: "aftereffects",
    name: "Adobe After Effects",
    category: "Motion Graphics",
    description: "Criação de efeitos visuais e animações",
    price: 99.0,
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%239999FF'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EAe%3C/text%3E%3C/svg%3E"
  }
];

const INITIAL_CART: Product[] = [
  {
    id: "photoshop",
    name: "Adobe Photoshop",
    category: "Editor de imagens",
    price: 49.0,
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23001F3F'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%2300C2E6' font-family='Arial' font-size='14' font-weight='bold'%3EPS%3C/text%3E%3C/svg%3E"
  }
];

// ===================== COMPONENT =====================
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
      border: "1px solid",
      borderColor: selected ? "primary.main" : "rgba(255,255,255,0.08)",
      bgcolor: selected ? "rgba(0,194,230,0.15)" : "rgba(255,255,255,0.02)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: '100%',
      gap: 1,
      minHeight: 60,
      transition: "all .3s ease",
      '&:hover': { borderColor: "primary.main" }
    }}
  >
    <Box sx={{ fontSize: 24, display: 'flex', alignItems: 'center' }}>{icon}</Box>
    <Typography>{label}</Typography>
  </Box>
);

export const Pagamento: React.FC = () => {
  const [method, setMethod] = useState<"credit" | "pix" | "paypal">("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [promo, setPromo] = useState("");

  const [cart, setCart] = useState<Product[]>(INITIAL_CART);
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

  // Price animation state
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 250);
    return () => clearTimeout(t);
  }, [total, subtotal]);

  // Helpers
  const validate = () => {
    if (method === "credit") {
      const plain = cardNumber.replace(/\s/g, "");
      if (plain.length !== 16) return alert("Por favor, insira um número de cartão válido."), false;
      if (!cardName.trim()) return alert("Por favor, insira o nome do titular do cartão."), false;
      if (cardExpiry.length !== 5) return alert("Por favor, insira a validade do cartão (MM/AA)."), false;
      if (cardCVV.length < 3) return alert("Por favor, insira o CVV do cartão."), false;
    }
    if (!firstName.trim()) return alert("Por favor, insira seu nome."), false;
    if (!lastName.trim()) return alert("Por favor, insira seu sobrenome."), false;
    if (!email.trim() || !email.includes("@")) return alert("Por favor, insira um e-mail válido."), false;
    if (cpf.replace(/\D/g, "").length !== 11) return alert("Por favor, insira um CPF válido."), false;
    return true;
  };

  // Card network detection (simple)
  const cardBrand = useMemo(() => {
    const v = cardNumber.replace(/\s/g, "");
    if (v.startsWith("4")) return <FaCcVisa size={36}/>;
    if (v.startsWith("5") || v.startsWith("2")) return <FaCcMastercard size={36}/>;
    if (v.startsWith("3")) return <FaCcAmex size={36}/>;
    return "";
  }, [cardNumber]);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
    }, 3000);
  };

  // Autofocus chain
  useEffect(() => {
    const node = cardNumberRef.current;
    const handler = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.value.replace(/\s/g, "").length === 16) cardExpiryRef.current?.focus();
    };
    node?.addEventListener("keyup", handler);
    return () => node?.removeEventListener("keyup", handler);
  }, []);

  useEffect(() => {
    const node = cardExpiryRef.current;
    const handler = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.value.length === 5) cardCVVRef.current?.focus();
    };
    node?.addEventListener("keyup", handler);
    return () => node?.removeEventListener("keyup", handler);
  }, []);

  // Mobile smooth scroll into view on focus
  useEffect(() => {
    const inputs = Array.from(document.querySelectorAll("input"));
    const small = window.innerWidth <= 768;
    if (!small) return;
    const focusHandler = (e: Event) => {
      const el = e.target as HTMLElement;
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
    };
    inputs.forEach((i) => i.addEventListener("focus", focusHandler));
    return () => inputs.forEach((i) => i.removeEventListener("focus", focusHandler))
  }, []);

  // Promo apply
  const applyPromo = () => {
    if (!promo.trim()) return;
    if (promo.toLowerCase() === "desconto10") {
      alert("Código promocional aplicado! Desconto de 10% concedido.");
    } else {
      alert("Código promocional inválido.");
    }
  };

  // Modal helpers
  const openModal = () => {
    setSelected({});
    setModalOpen(true);
    // (document.body as any).style.overflow = "hidden";
  };
  const closeModal = () => {
    setModalOpen(false);
    // (document.body as any).style.overflow = "auto";
  };
  const confirmSelection = () => {
    const picks = AVAILABLE_PRODUCTS.filter((p) => selected[p.id]);
    if (picks.length) {
      setCart((c) => [...c, ...picks]);
      closeModal();
    }
  };
  const removeFromCart = (id: string) => setCart((c) => c.filter((p) => p.id !== id));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--primary-navy": "#001F3F",
            "--primary-cyan": "#00C2E6",
            "--text-primary": "#FFFFFF",
            "--text-secondary": "rgba(255,255,255,0.7)",
            "--text-muted": "rgba(255,255,255,0.5)",
            "--surface-primary": "rgba(255,255,255,0.05)",
            "--surface-secondary": "rgba(255,255,255,0.02)",
            "--border-subtle": "rgba(255,255,255,0.08)",
            "--border-focus": "rgba(0,194,230,0.3)",
            "--success-green": "#28a745",
            "--warning-orange": "#ffc107",
            "--danger-red": "#dc3545"
          },
          body: {
            background: "linear-gradient(180deg, #001F3F 0%, #000814 100%)",
            minHeight: "100%",
            fontFeatureSettings: '"kern" 1, "liga" 1',
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          },
          a: { color: "inherit" }
        }}
      />

      {/* HEADER */}
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          bgcolor: "rgba(0,31,63,0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0,194,230,0.2)"
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#00C2E6", flexGrow: 1 }}>
            SoftHive
          </Typography>
          <Button color="inherit" startIcon={<ArrowBackIcon />} sx={{ color: "var(--text-secondary)" }}>
            Voltar
          </Button>
        </Toolbar>
      </AppBar>

      {/* MAIN */}
      <Box component="main" sx={{ mt: 10, py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Grid spacing={6} sx={{display: 'flex', gap: 5, flexWrap: 'wrap'}}>
            {/* LEFT: FORM */}
            <Grid sx={{maxWidth: 704}}>
              <Card sx={{ p: { xs: 3, md: 4 } }}>
                <CardContent sx={{ p: 0 }}>
                  {/* Header */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                      Finalizar Compra
                    </Typography>
                    <Typography sx={{ color: "var(--text-secondary)" }}>
                      Complete os dados abaixo para concluir sua compra
                    </Typography>
                  </Box>

                  {/* Success */}
                  <Box sx={{ mb: 2, display: success ? "block" : "none" }}>
                    <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ bgcolor: "var(--success-green)", color: "#fff" }}>
                      Pagamento processado com sucesso!
                    </Alert>
                  </Box>

                  <Box component="form" onSubmit={onSubmit}>
                    {/* Método de Pagamento */}
                    <Box sx={{ mb: 4 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <Typography variant="h6" fontWeight={600}>
                          Método de Pagamento
                        </Typography>
                      </Stack>

                      <Grid spacing={2} sx={{
                        display: 'flex',
                        gap: 2
                      }}>
                        <PaymentMethodCard
                            icon={<CreditCardIcon />}
                            label="Cartão"
                            selected={method === "credit"}
                            onClick={() => setMethod("credit")}
                          />
                        <PaymentMethodCard
                            icon={<QrCode2Icon />}
                            label="PIX"
                            selected={method === "pix"}
                            onClick={() => setMethod("pix")}
                          />
                        
                      </Grid>
                    </Box>

                    {/* Cartão de Crédito */}
                    {method === "credit" && (
                      <>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <LockIcon fontSize="small" />
                        <Typography variant="h6" fontWeight={600}>
                          Dados do Cartão
                        </Typography>
                      </Stack>
                      <Box sx={{ mb: 4, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2}}>
                       <Box sx={{position: 'relative'}}>
                        <TextField
                          fullWidth
                          label="Número do Cartão"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          inputRef={cardNumberRef}
                          inputProps={{ maxLength: 19 }}
                          sx={{
                            width: '100%'
                          }}
                        />
                        {cardBrand && (
                          <Box
                            sx={{
                              position: "absolute",
                              right: 10,
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "var(--primary-cyan)",
                              fontWeight: 700,
                              letterSpacing: 0.5
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
                          onChange={(e) => setCardName(e.target.value)}
                          
                        />

                        <TextField
                            fullWidth
                            label="Validade"
                            placeholder="MM/AA"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            inputRef={cardExpiryRef}
                            inputProps={{ maxLength: 5 }}
                          />
                        <TextField
                            fullWidth
                            label="CVV"
                            placeholder="123"
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            inputRef={cardCVVRef}
                            inputProps={{ maxLength: 4 }}
                          />
                        
                      </Box>
                      <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: 1,
                            border: "1px solid var(--border-subtle)",
                            bgcolor: "var(--surface-secondary)",
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                          }}
                        >
                          <ShieldIcon sx={{ color: "var(--success-green)" }} />
                          <Box>
                            <Typography fontWeight={700} variant="body2">
                              Pagamento 100% seguro
                            </Typography>
                            <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                              Seus dados são protegidos com criptografia SSL
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    )}

                    {/* PIX */}
                    {method === "pix" && (
                      <Box sx={{ mb: 4, textAlign: "center", p: 4 }}>
                        <Box
                          sx={{
                            width: 200,
                            height: 200,
                            bgcolor: "#fff",
                            mx: "auto",
                            mb: 2,
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <QrCode2Icon sx={{ fontSize: 64, color: "#333" }} />
                        </Box>
                        <Typography sx={{ color: "var(--text-secondary)", mb: 1 }}>
                          Escaneie o QR Code com seu app do banco
                        </Typography>
                        <Typography variant="body2" sx={{ color: "var(--text-muted)" }}>
                          Ou use a chave PIX: <b>softhive@payment.com</b>
                        </Typography>
                      </Box>
                    )}

                    {/* Billing */}
                    <Box sx={{ mb: 4}}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <Typography variant="h6" fontWeight={600}>
                          Informações de Cobrança
                        </Typography>
                      </Stack>

                      <Grid container spacing={2}>
                        <Grid>
                          <TextField
                            fullWidth
                            label="Nome"
                            placeholder="Seu nome"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </Grid>
                        <Grid>
                          <TextField
                            fullWidth
                            label="Sobrenome"
                            placeholder="Seu sobrenome"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </Grid>
                        <Grid>
                          <TextField
                            fullWidth
                            label="E-mail"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                          />
                        </Grid>
                        <Grid>
                          <TextField
                            fullWidth
                            label="CPF"
                            placeholder="000.000.000-00"
                            value={cpf}
                            onChange={(e) => setCpf(formatCPF(e.target.value))}
                            inputProps={{ maxLength: 14 }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Submit */}
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={submitting ? <CircularProgress size={20} /> : <CreditCardIcon />}
                      disabled={submitting}
                      fullWidth
                      sx={{
                        py: 1.5,
                        background: "linear-gradient(135deg, var(--primary-cyan), #0099cc)",
                        boxShadow: submitting ? "none" : "0 10px 30px rgba(0,194,230,0.3)",
                        '&:hover': { transform: submitting ? 'none' : 'translateY(-2px)' }
                      }}
                    >
                      {submitting ? "Processando pagamento..." : success ? "Pagamento Concluído" : "Finalizar Compra"}
                    </Button>
                  </Box>

                  {/* Post-success download block */}
                  {success && (
                    <Box sx={{ mt: 3 }}>
                      <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ bgcolor: "var(--success-green)", color: "#fff", mb: 2 }}>
                        Pagamento Aprovado! Seu download será disponibilizado em instantes.
                      </Alert>
                      <Box sx={{ textAlign: "center" }}>
                        <Button variant="contained" startIcon={<DownloadIcon />}>
                          Fazer Download
                        </Button>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* RIGHT: SUMMARY */}
            <Grid sx={{width: 400}}>
              <Card sx={{ p: { xs: 3, md: 3 }, position: { md: "sticky" }, top: { md: 100 }, width: '100%' }}>
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Resumo do Pedido
                  </Typography>

                  {/* Product list (first item pre-filled) */}
                  {cart.map((p, idx) => (
                    <Box key={p.id} sx={{
                      display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 2,
                      borderRadius: 1,
                      bgcolor: 'var(--surface-secondary)'
                    }}>
                      <Box sx={{ width: 50, height: 50, borderRadius: 1, overflow: 'hidden', flexShrink: 0 }}>
                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={600}>{p.name}</Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                          {p.category}
                        </Typography>
                      </Box>
                      <Typography fontWeight={700} sx={{ color: 'var(--primary-cyan)' }}>
                        {currency(p.price)}
                      </Typography>
                      {idx > 0 && (
                        <IconButton size="small" onClick={() => removeFromCart(p.id)} sx={{ ml: 1 }}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  ))}

                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={openModal}
                    fullWidth
                    sx={{
                      mb: 2,
                      borderColor: "var(--border-subtle)",
                      bgcolor: "var(--surface-secondary)",
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(0,194,230,0.15)' }
                    }}
                  >
                    Adicionar mais produtos
                  </Button>

                  {/* Promo code */}
                  <Grid sx={{ mb: 2 }}>
                    <Grid>
                      <TextField
                        fullWidth
                        placeholder="Código promocional"
                        value={promo}
                        onChange={(e) => setPromo(e.target.value)}
                      />
                    </Grid>
                    <Grid>
                      <Button fullWidth variant="outlined" onClick={applyPromo} sx={{ height: '100%' }}>
                        Aplicar
                      </Button>
                    </Grid>
                  </Grid>

                  {/* Breakdown */}
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Subtotal</Typography>
                      <Typography sx={{ transform: pulse ? 'scale(1.05)' : 'none', color: 'inherit' }}>
                        {currency(subtotal)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Desconto</Typography>
                      <Typography>{currency(discount)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Impostos</Typography>
                      <Typography>{currency(taxes)}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" fontWeight={700} sx={{ color: 'var(--primary-cyan)' }}>
                        Total
                      </Typography>
                      <Typography variant="h6" fontWeight={700} sx={{ color: 'var(--primary-cyan)', transform: pulse ? 'scale(1.05)' : 'none' }}>
                        {currency(total)}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Perks */}
                  <Box sx={{ mt: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <DownloadIcon sx={{ color: 'var(--primary-cyan)' }} />
                      <Typography variant="body2">Download imediato após pagamento</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <ShieldIcon sx={{ color: 'var(--success-green)' }} />
                      <Typography variant="body2">100% livre de vírus</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <HeadsetMicIcon sx={{ color: 'var(--primary-cyan)' }} />
                      <Typography variant="body2">Suporte técnico incluso</Typography>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)' }}>
          <Typography variant="h6" fontWeight={700}>Adicionar Produtos</Typography>
          <IconButton onClick={closeModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            {AVAILABLE_PRODUCTS.filter((p) => !cart.find((c) => c.id === p.id)).map((p) => {
              const isChecked = !!selected[p.id];
              return (
                <Grid key={p.id}>
                  <Box
                    onClick={() => setSelected((s) => ({ ...s, [p.id]: !s[p.id] }))}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: isChecked ? 'primary.main' : 'var(--border-subtle)',
                      bgcolor: isChecked ? 'rgba(0,194,230,0.15)' : 'var(--surface-secondary)',
                      transition: 'all .3s ease',
                      cursor: 'pointer',
                      '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(0,194,230,0.15)' },
                      position: 'relative'
                    }}
                  >
                    <Checkbox
                      checked={isChecked}
                      onChange={() => setSelected((s) => ({ ...s, [p.id]: !s[p.id] }))}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                      <Box sx={{ width: 60, height: 60, borderRadius: 1, overflow: 'hidden', flexShrink: 0 }}>
                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>{p.name}</Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>{p.category}</Typography>
                      </Box>
                    </Stack>
                    {p.description && (
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                        {p.description}
                      </Typography>
                    )}
                    <Typography variant="h6" fontWeight={700} sx={{ color: 'var(--primary-cyan)' }}>
                      {currency(p.price)}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)' }}>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            {Object.values(selected).filter(Boolean).length} produto{Object.values(selected).filter(Boolean).length !== 1 ? 's' : ''} selecionado{Object.values(selected).filter(Boolean).length !== 1 ? 's' : ''}
          </Typography>
          <Box>
            <Button onClick={closeModal} variant="outlined" sx={{ mr: 1 }}>Cancelar</Button>
            <Button onClick={confirmSelection} variant="contained">Confirmar Seleção</Button>
          </Box>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};