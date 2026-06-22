import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, LogIn, Mail, Scissors, ShieldCheck, Store } from 'lucide-react';
import { DUMMY_ADMIN_EMAIL, DUMMY_ADMIN_PASSWORD } from '../services/authService';
import { useAuth } from '../state/AuthContext';

interface LoginLocationState {
  from?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState(DUMMY_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const redirectTarget = (location.state as LoginLocationState | null)?.from ?? '/';

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!login(email, password)) {
      setError('Email atau password admin tidak sesuai.');
      return;
    }

    navigate(redirectTarget, { replace: true });
  };

  return (
    <div style={styles.container}>
      <section style={styles.brandPanel}>
        <div style={styles.brandShade} />
        <img src="/Logo Suma Barbershop.png" alt="Suma Barbershop" style={styles.logo} />
        <div style={styles.brandCopy}>
          <p style={styles.eyebrow}><ShieldCheck size={14} /> Admin only</p>
          <h1 style={styles.brandTitle}>Suma Barbershop POS</h1>
          <p style={styles.brandText}>Area privat untuk owner/admin. Halaman booking pelanggan tetap bisa diakses publik tanpa login.</p>
          <Link to="/booking" style={styles.publicLink}>Buka halaman booking publik</Link>
        </div>
      </section>

      <main style={styles.formPanel}>
        <form onSubmit={handleLogin} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.iconCircle}><Scissors size={24} /></span>
            <h2 style={styles.cardTitle}>Masuk ke Dashboard</h2>
            <p style={styles.cardSubtitle}>Silakan login sebagai admin untuk mengakses halaman tersebut.</p>
          </div>

          <label style={styles.field}>
            <span>Email Admin</span>
            <div style={styles.inputWrap}>
              <Mail size={18} color="#888" />
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" style={styles.input} required />
            </div>
          </label>

          <label style={styles.field}>
            <span>Password</span>
            <div style={styles.inputWrap}>
              <Lock size={18} color="#888" />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                style={styles.input}
                required
              />
              <button type="button" onClick={() => setShowPassword((current) => !current)} style={styles.eyeButton} aria-label="Tampilkan password">
                {showPassword ? <EyeOff size={18} color="#888" /> : <Eye size={18} color="#888" />}
              </button>
            </div>
          </label>

          <div style={styles.branchHint}>
            <Store size={16} />
            <span>Suma Barbershop - Cabang Utama</span>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <button type="submit" style={styles.submitButton}>
            <LogIn size={18} />
            <span>Masuk Dashboard</span>
          </button>

          <div style={styles.demoBox}>
            <strong>Credential demo</strong>
            <span>Email: {DUMMY_ADMIN_EMAIL}</span>
            <span>Password: {DUMMY_ADMIN_PASSWORD}</span>
          </div>
        </form>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', display: 'grid', gridTemplateColumns: 'minmax(0, 0.95fr) minmax(380px, 1.05fr)', background: '#F5F0E8', fontFamily: 'var(--font-body)' },
  brandPanel: { position: 'relative', minHeight: '100vh', backgroundImage: 'url("/suma-barbershop-image.PNG")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 34, overflow: 'hidden' },
  brandShade: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,63,49,0.62), rgba(7,42,32,0.95))' },
  logo: { position: 'relative', zIndex: 1, width: 180, maxWidth: '48%', height: 'auto', objectFit: 'contain' },
  brandCopy: { position: 'relative', zIndex: 1, maxWidth: 520, color: '#fff' },
  eyebrow: { display: 'inline-flex', alignItems: 'center', gap: 7, color: '#F4D9A4', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.6, margin: 0 },
  brandTitle: { margin: '12px 0 0', fontFamily: 'var(--font-heading)', fontSize: 42, lineHeight: 1.05, color: '#fff' },
  brandText: { margin: '12px 0 18px', color: 'rgba(255,255,255,0.84)', fontSize: 14, lineHeight: 1.7 },
  publicLink: { display: 'inline-flex', height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: '#F4D9A4', color: '#0F3F31', padding: '0 16px', fontWeight: 900, fontSize: 12 },
  formPanel: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backgroundImage: 'url("/background-suma-web-light.png")', backgroundSize: 'cover', backgroundPosition: 'center' },
  card: { width: '100%', maxWidth: 450, background: 'rgba(255,255,255,0.94)', border: '1px solid #E6D8C6', borderRadius: 18, padding: 30, boxShadow: '0 24px 70px rgba(85,58,25,0.12)' },
  cardHeader: { textAlign: 'center', marginBottom: 24 },
  iconCircle: { width: 62, height: 62, borderRadius: '50%', margin: '0 auto 15px', background: '#FBF3E8', color: '#0F3F31', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { margin: 0, fontFamily: 'var(--font-heading)', color: '#10281F', fontSize: 24 },
  cardSubtitle: { margin: '7px 0 0', color: '#6E6A64', fontSize: 13, lineHeight: 1.5 },
  field: { display: 'flex', flexDirection: 'column', gap: 7, color: '#4E4944', fontSize: 12, fontWeight: 900, marginBottom: 14 },
  inputWrap: { height: 44, border: '1px solid #E6D8C6', borderRadius: 10, background: '#FFFDF9', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px' },
  input: { flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-body)', color: '#10281F', fontSize: 14 },
  eyeButton: { width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' },
  branchHint: { height: 40, borderRadius: 10, background: '#FBF3E8', color: '#0F3F31', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', fontSize: 12, fontWeight: 900, marginBottom: 14 },
  errorBox: { borderRadius: 10, background: '#FBE2DA', color: '#C75B3A', padding: '10px 12px', fontSize: 12, fontWeight: 900, marginBottom: 12 },
  submitButton: { width: '100%', height: 46, borderRadius: 10, background: '#0F3F31', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 900, boxShadow: '0 15px 28px rgba(15,63,49,0.22)' },
  demoBox: { marginTop: 14, borderRadius: 10, border: '1px solid #E6D8C6', background: '#FFFDF9', padding: 12, display: 'flex', flexDirection: 'column', gap: 4, color: '#6E6A64', fontSize: 12 },
};
