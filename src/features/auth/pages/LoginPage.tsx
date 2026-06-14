import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scissors,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Store,
  ChevronDown,
  LogIn,
  ShieldCheck
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi login, arahkan ke dashboard
    navigate('/');
  };

  return (
    <div style={styles.container}>
      {/* KIRI - Branding */}
      <div style={styles.leftPanel}>
        <div style={styles.patternTop} />
        <div style={styles.patternBottom} />
        
        <div style={styles.brandContent}>
          <img src="/logo.png" alt="Suma Barber" style={styles.logo} />
          
          <div style={styles.divider}>
            <span style={styles.dividerDot} />
            <span style={styles.dividerDot} />
            <span style={styles.dividerDot} />
          </div>
          
          <h1 style={styles.brandTitle}>Suma Barbershop POS</h1>
          <p style={styles.brandSubtitle}>
            Sistem manajemen kasir & admin<br />
            untuk barbershop profesional
          </p>
        </div>
      </div>

      {/* KANAN - Form Login */}
      <div style={styles.rightPanel}>
        <div style={styles.loginCard}>
          
          {/* Header Card */}
          <div style={styles.cardHeader}>
            <div style={styles.iconWrapper}>
              <Scissors size={24} color="#1A3325" />
            </div>
            <h2 style={styles.cardTitle}>Masuk ke Suma POS</h2>
            <p style={styles.cardSubtitle}>Akses privat untuk owner/admin</p>
          </div>

          <form onSubmit={handleLogin} style={styles.form}>
            {/* Email Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Owner</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} color="#888" style={styles.inputIcon} />
                <input 
                  type="email" 
                  placeholder="owner@suma.com" 
                  style={styles.input}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} color="#888" style={styles.inputIcon} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Masukkan password" 
                  style={styles.input}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? <EyeOff size={18} color="#888" /> : <Eye size={18} color="#888" />}
                </button>
              </div>
            </div>

            {/* Branch Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Cabang Aktif</label>
              <div style={styles.inputWrapper}>
                <Store size={18} color="#888" style={styles.inputIcon} />
                <select style={styles.select}>
                  <option value="utama">Suma Barbershop - Cabang Utama</option>
                  <option value="cabang1">Suma Barbershop - Cabang 1</option>
                  <option value="cabang2">Suma Barbershop - Cabang 2</option>
                </select>
                <ChevronDown size={18} color="#888" style={styles.selectIcon} />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" style={styles.submitButton}>
              <LogIn size={18} />
              <span>Masuk Dashboard</span>
            </button>
          </form>

          {/* Footer Card */}
          <div style={styles.cardFooter}>
            <ShieldCheck size={20} color="#1A3325" />
            <p style={styles.footerText}>
              Akses privat untuk owner/admin.<br />
              Pastikan data login Anda aman.
            </p>
          </div>
        </div>

        {/* Page Footer */}
        <div style={styles.pageFooter}>
          <span style={styles.footerDeco}>✧</span>
          <span>Suma Barbershop POS</span>
          <span style={styles.footerDot}>•</span>
          <span>Dashboard Admin</span>
          <span style={styles.footerDeco}>✧</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif",
  },
  
  // --- PANEL KIRI ---
  leftPanel: {
    flex: 1,
    background: '#1A3325', // Heritage Green
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  patternTop: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, rgba(26,51,37,0) 70%)',
  },
  patternBottom: {
    position: 'absolute',
    bottom: -150,
    right: -100,
    width: 400,
    height: 400,
    background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, rgba(26,51,37,0) 70%)',
  },
  brandContent: {
    textAlign: 'center',
    zIndex: 1,
    padding: 40,
  },
  logo: {
    height: 80,
    marginBottom: 40,
    // Mengubah logo hitam menjadi warna emas (Gold #C9A84C) menggunakan filter
    filter: 'brightness(0) saturate(100%) invert(70%) sepia(40%) saturate(700%) hue-rotate(5deg) brightness(95%) contrast(85%)',
  },
  divider: {
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dividerDot: {
    width: 6,
    height: 6,
    background: '#C9A84C',
    borderRadius: '50%',
    opacity: 0.5,
  },
  brandTitle: {
    color: '#C9A84C',
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 12,
  },
  brandSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    lineHeight: 1.6,
  },

  // --- PANEL KANAN ---
  rightPanel: {
    flex: 1.2,
    background: '#F8F5F0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
  },
  loginCard: {
    background: '#FFFFFF',
    width: '100%',
    maxWidth: 440,
    borderRadius: 16,
    padding: '40px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
    border: '1px solid #E8E2D8',
    zIndex: 1,
  },
  
  // Card Header
  cardHeader: {
    textAlign: 'center',
    marginBottom: 32,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    background: '#F5EDD6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  cardTitle: {
    color: '#1A3325',
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
    fontFamily: "'Playfair Display', serif",
  },
  cardSubtitle: {
    color: '#666',
    fontSize: 14,
  },

  // Form
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    marginBottom: 32,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#333',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    height: 46,
    padding: '0 40px',
    borderRadius: 8,
    border: '1px solid #E8E2D8',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
    background: '#fff',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  select: {
    width: '100%',
    height: 46,
    padding: '0 40px',
    borderRadius: 8,
    border: '1px solid #E8E2D8',
    fontSize: 14,
    outline: 'none',
    appearance: 'none',
    background: '#fff',
    fontFamily: 'inherit',
    cursor: 'pointer',
    color: '#333',
    boxSizing: 'border-box'
  },
  selectIcon: {
    position: 'absolute',
    right: 14,
    pointerEvents: 'none',
  },
  submitButton: {
    height: 48,
    background: '#1A3325',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    transition: 'background 0.2s',
  },

  // Card Footer
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 24,
    borderTop: '1px solid #F0EBE1',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 1.5,
  },

  // Page Footer
  pageFooter: {
    position: 'absolute',
    bottom: 30,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: 12,
    color: '#888',
  },
  footerDeco: {
    color: '#C9A84C',
  },
  footerDot: {
    fontSize: 10,
    opacity: 0.5,
  }
};
