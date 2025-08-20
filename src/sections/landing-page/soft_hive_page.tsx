import React, { useEffect } from "react";
import {
  Box,
  Card,
  Button,
  Typography,
  createTheme,
  CssBaseline,
  CardContent,
  ThemeProvider,
  Link as MuiLink,
} from "@mui/material";

// ⚙️ Tema base (você pode ajustar se desejar usar palette do MUI)
const theme = createTheme({
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Fira Sans",
      "Droid Sans",
      "Helvetica Neue",
      "sans-serif",
    ].join(","),
  },
});

// 🔗 Injeta os links de fontes/ícones como no HTML original
function useHeadLinks(): void {
  useEffect(() => {
    const interHref =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
    const faHref =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";

    const linkInter = document.createElement("link");
    linkInter.rel = "stylesheet";
    linkInter.href = interHref;

    const linkFA = document.createElement("link");
    linkFA.rel = "stylesheet";
    linkFA.href = faHref;

    document.head.appendChild(linkInter);
    document.head.appendChild(linkFA);

    return () => {
      document.head.removeChild(linkInter);
      document.head.removeChild(linkFA);
    };
  }, []);
}

// 🎞️ Observers e efeitos (animações + parallax das bolas)
function useAnimations(): void {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    } as IntersectionObserverInit;

    const onIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    };

    const observer = new IntersectionObserver(onIntersect, observerOptions);

    const init = () => {
      if (window.matchMedia("(min-width: 769px)").matches) {
        const elementsToObserve = document.querySelectorAll(
          ".fade-in, .slide-in-left, .slide-in-right"
        );
        elementsToObserve.forEach((el) => observer.observe(el));
      } else {
        const elements = document.querySelectorAll(
          ".fade-in, .slide-in-left, .slide-in-right"
        );
        elements.forEach((el) => {
          el.classList.remove("fade-in", "slide-in-left", "slide-in-right");
          el.classList.add("visible");
        });
      }
    };

    const onScroll = () => {
      if (window.innerWidth > 768) {
        const scrolled = window.pageYOffset;
        const balls = document.querySelectorAll<HTMLElement>(".floating-ball");
        balls.forEach((ball, index) => {
          const speed = 0.1 + index * 0.02;
          ball.style.transform = `translateY(${scrolled * speed}px)`; // mantém transform coerente a cada frame
        });
      }
    };

    init();
    window.addEventListener("scroll", onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}

// 🧾 Estilos originais (copiados do index.html para manter 100% de fidelidade visual)
const ORIGINAL_CSS = `
  :root {
    --primary-navy: #001F3F;
    --primary-cyan: #00C2E6;
    --text-primary: #FFFFFF;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --text-muted: rgba(255, 255, 255, 0.5);
    --surface-primary: rgba(255, 255, 255, 0.05);
    --surface-secondary: rgba(255, 255, 255, 0.02);
    --border-subtle: rgba(255, 255, 255, 0.08);
    --border-focus: rgba(0, 194, 230, 0.3);
    --shadow-soft: 0 4px 24px rgba(0, 31, 63, 0.4);
    --shadow-medium: 0 8px 32px rgba(0, 31, 63, 0.6);
    --shadow-strong: 0 16px 64px rgba(0, 31, 63, 0.8);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --spacing-xs: 8px;
    --spacing-sm: 16px;
    --spacing-md: 24px;
    --spacing-lg: 32px;
    --spacing-xl: 48px;
    --spacing-2xl: 64px;
    --spacing-3xl: 96px;
  }
  html, body { overflow-x: hidden; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(180deg, #001F3F 0%, #000814 100%);
    color: var(--text-primary);
    line-height: 1.5;
    font-feature-settings: 'kern' 1, 'liga' 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  a { text-decoration: none; color: var(--primary-navy); }
  button:focus { outline: none; box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5); }
  button:focus { outline: none; border: 2px solid #007bff; }

  .header {
    background: rgba(0, 31, 63, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
    position: fixed; top: 0; width: 100%; z-index: 1000;
    transition: all 0.3s ease; border-bottom: 1px solid rgba(0, 194, 230, 0.2);
  }
  .header-container { max-width: 1200px; margin: 0 auto; padding: 1rem var(--spacing-md); display: flex; align-items: center; justify-content: space-between; }
  .logo { width: 150px; height: 44px; display:inline-flex; align-items:center; }

  .h1 { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.025em; }
  .h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.2; letter-spacing: -0.02em; }
  .h3 { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 600; line-height: 1.3; letter-spacing: -0.015em; }
  .body-lg { font-size: 1.25rem; font-weight: 400; line-height: 1.6; }
  .body { font-size: 1rem; font-weight: 400; line-height: 1.6; }
  .body-sm { font-size: 0.875rem; font-weight: 400; line-height: 1.5; }

  .container { max-width: 1200px; margin: 0 auto; padding: 0 var(--spacing-md); }
  .section { padding: var(--spacing-3xl) 0; }
  .section-sm { padding: var(--spacing-2xl) 0; }

  .btn-header {
    display: inline-flex; align-items: center; justify-content: center;
    font-family: inherit; font-weight: 600; text-decoration: none; border: none;
    border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s cubic-bezier(0.4,0,0.2,1); white-space: nowrap;
    background: linear-gradient(135deg, var(--primary-cyan), #0099cc);
    color: rgba(0,31,63,0.95); padding: 1rem 2rem; font-size: 0.95rem; box-shadow: var(--shadow-soft);
  }
  .btn-header:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0, 194, 230, 0.3); }
  .btn-header:active { transform: translateY(0); }

  .btn { display:inline-flex; align-items:center; justify-content:center; font-family:inherit; font-weight:600; text-decoration:none; border:none; border-radius: var(--radius-md); cursor:pointer; transition: all 0.2s cubic-bezier(0.4,0,0.2,1); white-space:nowrap; }
  .btn-primary { background: linear-gradient(135deg, var(--primary-cyan), #0099cc); color: white; padding: var(--spacing-sm) var(--spacing-lg); font-size: 1rem; box-shadow: var(--shadow-soft); }
  .btn-primary:hover { transform: translateY(-2px) scale(1.05); box-shadow: 0 10px 30px rgba(0, 194, 230, 0.3); }
  .btn-primary:active { transform: translateY(0); }
  .btn-lg { padding: var(--spacing-md) var(--spacing-xl); font-size: 1.125rem; border-radius: var(--radius-lg); }

  .card { background: var(--surface-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); backdrop-filter: blur(20px); transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
  .card:hover { border-color: #00c4e66c; transform: translateY(-10px) scale(1); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
  .product-card { padding: var(--spacing-lg); position: relative; overflow: hidden; }
  .product-card::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background: linear-gradient(90deg, var(--primary-cyan), #0099cc); transform: scaleX(0); transition: transform 0.3s ease; }
  .product-card:hover::before { transform: scaleX(1); }
  .product-icon img, .product-icon svg { max-width: 100%; max-height: 100%; height: auto; }

  .hero { min-height: 100vh; display:flex; align-items:center; position:relative; overflow:hidden; padding-top:80px; }
  .hero::before { content:''; position:absolute; top:50%; left:50%; width:800px; height:800px; background: radial-gradient(circle, rgba(0,194,230,0.08) 0%, transparent 60%); transform: translate(-50%, -50%); pointer-events:none; }
  .hero-content { position:relative; z-index:2; max-width: 800px; }
  .hero-badge { display:inline-flex; align-items:center; padding: var(--spacing-xs) var(--spacing-sm); background: var(--surface-primary); border:1px solid var(--border-focus); border-radius:999px; font-size:0.875rem; font-weight:500; color: var(--primary-cyan); margin-bottom: var(--spacing-md); }
  .hero-title { margin-bottom: var(--spacing-md); }
  .hero-description { color: var(--text-secondary); margin-bottom: var(--spacing-xl); max-width: 600px; }

  .floating-balls { position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1; }
  .floating-ball { position:absolute; width:100px; height:100px; border-radius:50%; background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%); backdrop-filter: blur(20px); border:1px solid rgba(0,194,230,0.3); display:flex; align-items:center; justify-content:center; overflow:hidden; cursor:pointer; pointer-events:auto; transition: all 0.4s cubic-bezier(0.4,0,0.2,1); box-shadow: 0 8px 32px rgba(0,31,63,0.3), inset 0 1px 0 rgba(255,255,255,0.2); }
  .floating-ball::before { content:''; position:absolute; top:-2px; left:-2px; right:-2px; bottom:-2px; background: linear-gradient(45deg, var(--primary-cyan), #0099cc, var(--primary-cyan), #00d4ff); border-radius:50%; opacity:0; transition: opacity 0.4s ease; z-index:-1; animation: rotate 3s linear infinite; }
  .floating-ball:hover::before { opacity: 1; }
  .floating-ball:hover { transform: scale(1.2) translateZ(0); border-color: rgba(0,194,230,0.6); box-shadow: 0 20px 60px rgba(0,194,230,0.4), 0 0 0 1px rgba(0,194,230,0.2), inset 0 1px 0 rgba(255,255,255,0.3); animation-play-state: paused !important; }
  .floating-ball img { width:65px; height:65px; border-radius:50%; object-fit:cover; transition: all 0.4s cubic-bezier(0.4,0,0.2,1); filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3)); z-index:2; }
  .floating-ball:hover img { transform: scale(1.1); filter: drop-shadow(0 6px 20px rgba(0,194,230,0.3)); }
  .floating-ball::after { content:''; position:absolute; top:15%; left:15%; width:30%; height:30%; background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%); border-radius:50%; filter: blur(10px); opacity:0.6; transition: opacity 0.3s ease; }
  .floating-ball:hover::after { opacity: 1; }
  @keyframes rotate { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
  .floating-ball:nth-child(1) { top:15%; left:10%; animation: float1 8s ease-in-out infinite; }
  .floating-ball:nth-child(2) { top:20%; right:10%; animation: float2 9s ease-in-out infinite; animation-delay: -1.5s; }
  .floating-ball:nth-child(3) { top:55%; left:3%; animation: float3 7s ease-in-out infinite; animation-delay: -3s; }
  .floating-ball:nth-child(4) { bottom:15%; right:15%; animation: float4 10s ease-in-out infinite; animation-delay: -4.5s; }
  .floating-ball:nth-child(5) { top:40%; right:3%; animation: float5 8s ease-in-out infinite; animation-delay: -6s; }
  @keyframes float1 { 0%,100%{transform:translateY(0px) translateX(0px) rotate(0deg);}25%{transform:translateY(-25px) translateX(15px) rotate(5deg);}50%{transform:translateY(-15px) translateX(-20px) rotate(-3deg);}75%{transform:translateY(-35px) translateX(10px) rotate(7deg);} }
  @keyframes float2 { 0%,100%{transform:translateY(0px) translateX(0px) rotate(0deg);}25%{transform:translateY(-20px) translateX(-15px) rotate(-4deg);}50%{transform:translateY(-40px) translateX(20px) rotate(6deg);}75%{transform:translateY(-10px) translateX(-25px) rotate(-8deg);} }
  @keyframes float3 { 0%,100%{transform:translateY(0px) translateX(0px) rotate(0deg);}25%{transform:translateY(-30px) translateX(20px) rotate(8deg);}50%{transform:translateY(-8px) translateX(-15px) rotate(-5deg);}75%{transform:translateY(-25px) translateX(25px) rotate(10deg);} }
  @keyframes float4 { 0%,100%{transform:translateY(0px) translateX(0px) rotate(0deg);}25%{transform:translateY(-15px) translateX(-20px) rotate(-6deg);}50%{transform:translateY(-35px) translateX(15px) rotate(4deg);}75%{transform:translateY(-20px) translateX(-10px) rotate(-9deg);} }
  @keyframes float5 { 0%,100%{transform:translateY(0px) translateX(0px) rotate(0deg);}25%{transform:translateY(-25px) translateX(12px) rotate(7deg);}50%{transform:translateY(-18px) translateX(-25px) rotate(-4deg);}75%{transform:translateY(-38px) translateX(18px) rotate(11deg);} }

  .problem-section { background: var(--surface-secondary); border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); }
  .problem-content { text-align:center; max-width:720px; margin:0 auto; }
  .problem-title { margin-bottom: var(--spacing-md); }
  .problem-description { color: var(--text-secondary); margin-bottom: var(--spacing-lg); }
  .problem-highlight { background: linear-gradient(135deg, var(--primary-cyan), #0099cc); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; font-weight:700; }

  .divisor { display:flex; position:relative; }
  .divisor-estilizado { position:relative; width:100%; height:1px; opacity:40%; background:transparent; display:flex; align-items:center; justify-content:center; overflow:hidden; z-index:-1; }
  .divisor-estilizado::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg, transparent 0%, rgba(0,194,230,0.3) 20%, rgba(0,194,230,0.8) 40%, rgba(0,194,230,0.8) 40%, rgba(0,194,230,0.3) 80%, transparent 100%); z-index:1; }
  .icone-redondo { position:absolute; top:50%; left:50%; transform: translate(-50%, -50%); z-index:5; width:80px; height:80px; background: linear-gradient(135deg, var(--primary-cyan), #0099cc); border:4px solid var(--primary-navy); border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow: var(--shadow-soft), 0 0 0 2px rgba(0,194,230,0.3), inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.2); transition: all 0.4s cubic-bezier(0.4,0,0.2,1); cursor:pointer; -webkit-tap-highlight-color:transparent; }
  .icone-redondo:hover { transform: scale(1.1) translate(-45%, -45%); box-shadow: 0 12px 40px rgba(0,194,230,0.6), 0 0 0 4px rgba(0,194,230,0.4), inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.3); }
  .icone-redondo::before { content:''; position:absolute; top:-8px; left:-8px; right:-8px; bottom:-8px; border:2px solid transparent; border-radius:50%; background: linear-gradient(45deg, var(--primary-cyan), transparent, var(--primary-cyan), transparent) border-box; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: xor; -webkit-mask-composite: xor; animation: rotate 3s linear infinite; opacity:0.7; }
  .icone-redondo::after { content:''; position:absolute; top:15%; left:15%; width:35%; height:35%; background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 40%, transparent 70%); border-radius:50%; filter:blur(4px); pointer-events:none; }
  .icone-redondo svg { color: var(--primary-navy); font-weight:bold; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3)); transition: all 0.3s ease; }
  .icone-redondo:hover svg { color: var(--text-primary); transform: scale(1.1); }

  .particulas { position:absolute; top:50%; left:50%; transform: translate(-50%, -50%); width:300px; height:300px; pointer-events:none; z-index:1; }
  .particula { position:absolute; width:4px; height:4px; background: var(--primary-cyan); border-radius:50%; opacity:0.6; animation: float-particle 4s ease-in-out infinite; }
  .particula:nth-child(1) { top:20%; left:30%; animation-delay:0s; }
  .particula:nth-child(2) { top:40%; right:20%; animation-delay:-1s; }
  .particula:nth-child(3) { bottom:30%; left:25%; animation-delay:-2s; }
  .particula:nth-child(4) { bottom:20%; right:30%; animation-delay:-3s; }
  @keyframes float-particle { 0%,100%{ transform: translateY(0px) scale(1); opacity:0.3; } 50%{ transform: translateY(-20px) scale(1.2); opacity:0.8; } }

  .ondas { position:absolute; top:150%; left:50%; transform: translate(-50%, -50%); width:400px; height:400px; pointer-events:none; z-index:1; }
  .onda { position:absolute; top:50%; left:50%; transform: translate(-50%, -50%); border:1px solid rgba(0,194,230,0.2); border-radius:50%; animation: expand 3s ease-out infinite; }
  .onda:nth-child(1) { width:120px; height:120px; animation-delay:0s; }
  .onda:nth-child(2) { width:180px; height:180px; animation-delay:-1s; }
  .onda:nth-child(3) { width:240px; height:240px; animation-delay:-2s; }
  @keyframes expand { 0%{ width:80px; height:80px; opacity:1; } 100%{ width:300px; height:300px; opacity:0; } }

  @media (max-width: 768px) {
    .divisor-estilizado { height: 1px; }
    .icone-redondo { width:60px; height:60px; border-width:3px; }
    .icone-redondo svg { width:20px; height:20px; }
    .particulas, .ondas { width:200px; height:200px; }
    .body-lg { font-size: 1rem; font-weight: 400; line-height: 1.6; }
    .container { padding: 0 var(--spacing-sm); }
    .section { padding: var(--spacing-2xl) 0; }
    .product-footer { flex-direction: column; align-items: flex-start; gap: var(--spacing-sm); }
    .hero { padding-top:60px; min-height:90vh; }
    .hero-content { text-align:center; max-width:100%; }
    .floating-balls { display:none; }
    .products-grid { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
    .card:hover { border-color: var(--border-subtle); transform:none; box-shadow:none; }
    .product-card:hover::before { transform: scaleX(0); }
    .hero-badge { padding: var(--spacing-xs) var(--spacing-sm); font-size: 0.8rem; }
  }

  .fade-in, .slide-in-left, .slide-in-right { opacity: 0; }
  .fade-in.visible { opacity: 1; transform: translateY(0); transition: all 0.6s cubic-bezier(0.4,0,0.2,1); }
  .slide-in-left { transform: translateX(-32px); transition: all 0.6s cubic-bezier(0.4,0,0.2,1); }
  .slide-in-left.visible { opacity: 1; transform: translateX(0); }
  .slide-in-right { transform: translateX(32px); transition: all 0.6s cubic-bezier(0.4,0,0.2,1); }
  .slide-in-right.visible { opacity: 1; transform: translateX(0); }

  @media (min-width: 769px) { .body-lg { font-weight: 400; line-height: 1.6; } }

  @media (max-width: 1024px) {
    .floating-ball { width:90px; height:90px; }
    .floating-ball img { width:60px; height:60px; }
    .floating-ball:nth-child(1) { top:15%; left:6%; }
    .floating-ball:nth-child(2) { top:18%; right:8%; }
    .floating-ball:nth-child(3) { top:75%; left:1%; }
    .floating-ball:nth-child(4) { bottom:12%; right:12%; }
    .floating-ball:nth-child(5) { top:42%; right:1%; }
  }
  @media (max-width: 1200px) {
    .floating-ball { width:85px; height:85px; }
    .floating-ball img { width:55px; height:55px; }
  }
  @media (max-width: 480px) {
    :root { --spacing-xs:6px; --spacing-sm:16px; --spacing-md:18px; --spacing-lg:24px; --spacing-xl:36px; --spacing-2xl:48px; --spacing-3xl:72px; }
    .floating-balls { display:none !important; }
    .hero { padding-top:80px; }
    .hero-content { padding: 0 10px; }
  }
  @media (max-width: 320px) {
    .hero { min-height:70vh; padding-top:60px; }
    .hero-badge { font-size:0.75rem; padding:6px 12px; }
  }

  .products-section { background: linear-gradient(180deg, transparent 0%, rgba(0, 194, 230, 0.02) 100%); }
  .products-header { text-align:center; margin-bottom: var(--spacing-2xl); }
  .products-title { margin-bottom: var(--spacing-sm); margin-top: 2rem; }
  .products-subtitle { color: var(--text-secondary); max-width:600px; margin:0 auto; }
  .products-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: var(--spacing-lg); }
  .product-header { display:flex; align-items:center; margin-bottom: var(--spacing-md); }
  .product-icon { width:50px; height:50px; border-radius: var(--radius-md); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.25rem; color:white; margin-right: var(--spacing-sm); }
  .product-info h3 { margin-bottom: 4px; }
  .product-info .product-category { color: var(--text-muted); font-size: 0.875rem; }
  .product-description { color: var(--text-secondary); margin-bottom: var(--spacing-lg); }
  .product-footer { display:flex; align-items:center; justify-content:space-between; }
  .product-price { font-size: 1.75rem; font-weight:700; color: var(--primary-cyan); }
  .product-price-original { font-size:1rem; color: var(--text-muted); text-decoration: line-through; margin-left: var(--spacing-xs); }

  .trust-section { position:relative; overflow:hidden; background: var(--surface-secondary); border-top: 1px solid var(--border-subtle); }
  .background-video { position:absolute; top:50%; left:50%; transform: translate(-50%, -50%); min-width:100%; min-height:100%; width:auto; height:auto; opacity:0.1; z-index:-1; }
  .trust-content { display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-xl); align-items:center; }
  .trust-text h2 { margin-bottom: var(--spacing-sm); }
  .trust-text p { color: var(--text-secondary); margin-bottom: var(--spacing-md); }
  .trust-features { display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-lg); }
  .trust-feature { display:flex; align-items:flex-start; gap: var(--spacing-sm); }
  .trust-feature-icon { width:24px; height:24px; background: var(--primary-cyan); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; color: var(--primary-navy); margin-top:2px; flex-shrink:0; }
  .trust-feature-text h4 { font-size:1rem; font-weight:600; margin-bottom:4px; }
  .trust-feature-text p { font-size:0.875rem; color: var(--text-secondary); margin:0; }

  .cta-section { background: linear-gradient(135deg, var(--primary-navy) 0%, #001122 100%); position:relative; overflow:hidden; }
  .cta-section::before { content:''; position:absolute; top:0; right:0; width:50%; height:100%; background: linear-gradient(135deg, transparent 0%, rgba(0, 194, 230, 0.1) 100%); pointer-events:none; }
  .cta-content { text-align:center; max-width:640px; margin:0 auto; position:relative; z-index:2; }
  .cta-title { margin-bottom: var(--spacing-sm); }
  .cta-description { color: var(--text-secondary); margin-bottom: var(--spacing-xl); }

  .footer { background: var(--primary-navy); color: var(--text-primary); padding: 3rem 2rem 2rem; text-align:center; }
  .footer-container { max-width:1200px; margin:0 auto; display:flex; flex-direction:column; align-items:center; gap:24px; }
  .footer-links { display:flex; justify-content:center; gap:2rem; margin-bottom:2rem; flex-wrap:wrap; }
  .footer-link { color: var(--text-secondary); text-decoration:none; font-size:0.9rem; transition: color 0.3s ease; }
  .footer-link:hover { color: var(--primary-cyan); }
  .footer-copyright { color: var(--text-secondary); font-size:0.9rem; }
`;

// 🔒 Types estritos para TSX
 type Product = {
  key: string;
  img: string;
  name: string;
  category: string;
  price: string;
  original: string;
  slideClass: "slide-in-left" | "slide-in-right";
  onBuyPrice: number;
 };

// 🧩 Dados dos produtos
const products: Product[] = [
  {
    key: "photoshop",
    img: "/Media/psd.webp",
    name: "Adobe Photoshop",
    category: "Editor de imagens",
    price: "R$24,98",
    original: "R$89,90/mês",
    slideClass: "slide-in-left",
    onBuyPrice: 49,
  },
  {
    key: "illustrator",
    img: "/Media/illustrator.webp",
    name: "Adobe Illustrator",
    category: "Design vetorial",
    price: "R$24,98",
    original: "R$89,90/mês",
    slideClass: "slide-in-right",
    onBuyPrice: 49,
  },
  {
    key: "premiere",
    img: "/Media/premiere-pro.webp",
    name: "Adobe Premiere Pro",
    category: "Edição de vídeo",
    price: "R$24,98",
    original: "R$89,90/mês",
    slideClass: "slide-in-left",
    onBuyPrice: 49,
  },
  {
    key: "coreldraw",
    img: "/Media/coreldraw.webp",
    name: "CorelDRAW",
    category: "Design gráfico",
    price: "R$34,98",
    original: "R$1920,00",
    slideClass: "slide-in-right",
    onBuyPrice: 39,
  },
  {
    key: "3dsmax",
    img: "/Media/autodesk-3ds.webp",
    name: "Autodesk 3ds Max",
    category: "Modelagem 3D",
    price: "R$59,60",
    original: "R$980/mês",
    slideClass: "slide-in-left",
    onBuyPrice: 59,
  },
  {
    key: "aftereffects",
    img: "/Media/after-effects.webp",
    name: "After Effects",
    category: "Motion graphics",
    price: "R$24,98",
    original: "R$89,90/mês",
    slideClass: "slide-in-right",
    onBuyPrice: 49,
  },
];

function scrollToProducts(): void {
  const el = document.getElementById("products");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function handlePurchase(
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  productName: string
) {
  const button = e.currentTarget;
  const originalHTML = button.innerHTML;

  // Feedback visual
  button.style.background = "#28a745";
  button.innerHTML = '<i class="fas fa-check"></i>&nbsp;Processando...';
  button.disabled = true;

  setTimeout(() => {
    button.innerHTML = '<i class="fas fa-shopping-cart"></i> Comprar Agora';
    button.style.background = "";
    button.disabled = false;

    setTimeout(() => {
      button.innerHTML = originalHTML;
    }, 2000);
  }, 1500);

  // Aqui entraria o redirecionamento real
  console.log(`Iniciando compra do produto: ${productName}`);
}

export function SoftHivePage() {
  useHeadLinks();
  useAnimations();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Estilos originais para manter 100% de fidelidade */}
      <style dangerouslySetInnerHTML={{ __html: ORIGINAL_CSS }} />

      {/* Header */}
      <Box component="header" className="header">
        <Box className="header-container">
          <MuiLink href="#" className="logo" sx={{ display: "inline-flex" }}>
            <img src="/Media/Logo/logo.svg" alt="Logo SoftHive" width={150} height={44} />
          </MuiLink>
          <Button className="btn-header" disableRipple>
            <MuiLink href="#" underline="none" sx={{ color: "rgba(0,31,63,0.95)" }}>
              Login
            </MuiLink>
          </Button>
        </Box>
      </Box>

      {/* Hero Section */}
      <Box component="section" className="hero section">
        <Box className="container">
          <Box className="hero-content fade-in">
            <Box className="hero-badge">✓ Verificado e Seguro</Box>
            <Typography component="h1" className="h1 hero-title">
              Softwares premium verificados para profissionais criativos
            </Typography>
            <Typography className="body-lg hero-description">
              Acesse as melhores ferramentas de criação com garantia de segurança total. Downloads verificados,
              instalação limpa, suporte dedicado.
            </Typography>
            <Button className="btn btn-primary btn-lg" onClick={scrollToProducts}>
              Ver Softwares Disponíveis
            </Button>
          </Box>
        </Box>

        {/* Bolas flutuantes */}
        <Box className="floating-balls">
          <Box className="floating-ball">
            <img src="/Media/psd.webp" alt="Photoshop" draggable={false} onContextMenu={(ev) => ev.preventDefault()} />
          </Box>
          <Box className="floating-ball">
            <img
              src="/Media/illustrator.webp"
              alt="Illustrator"
              draggable={false}
              onContextMenu={(ev) => ev.preventDefault()}
            />
          </Box>
          <Box className="floating-ball">
            <img
              src="/Media/premiere-pro.webp"
              alt="Premiere Pro"
              draggable={false}
              onContextMenu={(ev) => ev.preventDefault()}
            />
          </Box>
          <Box className="floating-ball">
            <img
              src="/Media/after-effects.webp"
              alt="After Effects"
              draggable={false}
              onContextMenu={(ev) => ev.preventDefault()}
            />
          </Box>
          <Box className="floating-ball">
            <img
              src="/Media/coreldraw.webp"
              alt="CorelDRAW"
              draggable={false}
              onContextMenu={(ev) => ev.preventDefault()}
            />
          </Box>
        </Box>
      </Box>

      {/* Problem Section */}
      <Box component="section" className="problem-section section-sm">
        <Box className="container">
          <Box className="problem-content fade-in">
            <Typography component="h2" className="h2 problem-title">
              Pare de pagar preços abusivos por software
            </Typography>
            <Typography className="body-lg problem-description">
              Enquanto as grandes empresas cobram milhares de reais por licenças, você pode ter acesso às mesmas
              ferramentas profissionais com <span className="problem-highlight">segurança garantida</span> e
              <span className="problem-highlight"> preços justos</span>.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Divisor estilizado */}
      <Box className="divisor">
        <Box className="ondas">
          <Box className="onda" />
          <Box className="onda" />
          <Box className="onda" />
        </Box>
        <Box className="particulas">
          <Box className="particula" />
          <Box className="particula" />
          <Box className="particula" />
          <Box className="particula" />
        </Box>
        <Box className="icone-redondo">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </Box>
        <Box className="divisor-estilizado" />
      </Box>

      {/* Products Section */}
      <Box component="section" className="products-section section" id="products">
        <Box className="container">
          <Box className="products-header fade-in">
            <Typography component="h2" className="h2 products-title">
              Escolha sua ferramenta de criação
            </Typography>
            <Typography className="body-lg products-subtitle">
              Cada software é cuidadosamente verificado e testado pela nossa equipe de segurança.
              <span className="problem-highlight"> Compra única, sem necessidade de renovação mensal.</span>
            </Typography>
          </Box>

          <Box className="products-grid">
            {products.map((p) => (
              <Card key={p.key} className={`card product-card ${p.slideClass}`} elevation={0}>
                <CardContent sx={{ p: 0 }}>
                  <Box className="product-header">
                    <Box className="product-icon">
                      <img src={p.img} alt={`Logo do ${p.name}`} />
                    </Box>
                    <Box className="product-info">
                      <Typography component="h3" className="h3">
                        {p.name}
                      </Typography>
                      <div className="product-category">{p.category}</div>
                    </Box>
                  </Box>

                  <Typography className="body product-description">
                    {p.key === "photoshop" && (
                      <>O padrão mundial para edição de imagens, design gráfico e fotografia digital. Ferramentas avançadas para criação profissional.</>
                    )}
                    {p.key === "illustrator" && (
                      <>Criação de gráficos vetoriais, logotipos, ícones e ilustrações complexas. Precisão matemática para designs escaláveis.</>
                    )}
                    {p.key === "premiere" && (
                      <>Editor de vídeo profissional usado por cineastas e criadores de conteúdo. Timeline avançada e efeitos cinematográficos.</>
                    )}
                    {p.key === "coreldraw" && (
                      <>Suite completa para design gráfico profissional. Ferramentas versáteis para impressão, web e projetos comerciais.</>
                    )}
                    {p.key === "3dsmax" && (
                      <>Software profissional para modelagem 3D, animação e renderização. Usado em games, filmes e visualização arquitetônica.</>
                    )}
                    {p.key === "aftereffects" && (
                      <>Criação de efeitos visuais, motion graphics e composição digital. Essencial para produção audiovisual profissional.</>
                    )}
                  </Typography>

                  <Box className="product-footer">
                    <Box>
                      <span className="product-price">{p.price}</span>
                      <span className="product-price-original">{p.original}</span>
                    </Box>
                    <Button
                      className="btn btn-primary"
                      onClick={(e) => handlePurchase(e, p.name)}
                      startIcon={<Box component="i" className="fas fa-download" aria-hidden />}
                    >
                      Comprar Agora
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Trust Section */}
      <Box component="section" className="trust-section section">
        <Box
          component="video"
          className="background-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/Media/security-bg.mp4" type="video/mp4" />
        </Box>
        <Box className="container">
          <Box className="trust-content">
            <Box className="trust-text slide-in-left">
              <Typography component="h2" className="h2">
                Sua segurança é nossa garantia
              </Typography>
              <Typography className="body">
                Todos os softwares passam por rigorosa verificação de segurança. Nossa equipe técnica testa cada arquivo antes da disponibilização.
              </Typography>
            </Box>

            <Box className="trust-features slide-in-right">
              <Box className="trust-feature">
                <Box className="trust-feature-icon">
                  <i className="fa-solid fa-circle-check" />
                </Box>
                <Box className="trust-feature-text">
                  <Typography component="h4" sx={{ fontSize: "1rem", fontWeight: 600, mb: "4px" }}>
                    100% Livre de Vírus
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "var(--text-secondary)", m: 0 }}>
                    Verificação completa com múltiplos antivírus
                  </Typography>
                </Box>
              </Box>

              <Box className="trust-feature">
                <Box className="trust-feature-icon">
                  <i className="fa-solid fa-shield" />
                </Box>
                <Box className="trust-feature-text">
                  <Typography component="h4" sx={{ fontSize: "1rem", fontWeight: 600, mb: "4px" }}>
                    Instalação Segura
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "var(--text-secondary)", m: 0 }}>
                    Processo limpo sem software adicional
                  </Typography>
                </Box>
              </Box>

              <Box className="trust-feature">
                <Box className="trust-feature-icon">
                  <i className="fa-solid fa-bolt" />
                </Box>
                <Box className="trust-feature-text">
                  <Typography component="h4" sx={{ fontSize: "1rem", fontWeight: 600, mb: "4px" }}>
                    Download Imediato
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "var(--text-secondary)", m: 0 }}>
                    Acesso instantâneo após a compra
                  </Typography>
                </Box>
              </Box>

              <Box className="trust-feature">
                <Box className="trust-feature-icon">
                  <i className="fa-solid fa-headset" />
                </Box>
                <Box className="trust-feature-text">
                  <Typography component="h4" sx={{ fontSize: "1rem", fontWeight: 600, mb: "4px" }}>
                    Suporte Técnico
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "var(--text-secondary)", m: 0 }}>
                    Assistência especializada quando precisar
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* CTA Section */}
      <Box component="section" className="cta-section section">
        <Box className="container">
          <Box className="cta-content fade-in">
            <Typography component="h2" className="h2 cta-title">
              Comece a criar hoje mesmo
            </Typography>
            <Typography className="body-lg cta-description">
              Milhares de profissionais já confiam na SoftHive. Junte-se a eles e transforme suas ideias em realidade.
            </Typography>
            <Button className="btn btn-primary btn-lg" onClick={scrollToProducts}>
              Escolher Meu Software
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box component="footer" className="footer">
        <Box className="footer-container">
          <MuiLink href="#" className="logo" sx={{ display: "inline-flex" }}>
            <img src="/Media/Logo/logo.svg" alt="Logo SoftHive" width={150} height={44} />
          </MuiLink>
          <Box className="footer-copyright">© 2025 SoftHive. Todos os direitos reservados.</Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
