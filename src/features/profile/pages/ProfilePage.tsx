import React from 'react';
import { User, Mail, MapPin, Phone, Shield } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Profile</h1>
        <p style={styles.subtitle}>Informasi akun dan detail pemilik cabang.</p>
      </div>

      <div style={styles.cardGrid}>
        <section style={styles.profileCard}>
          <div style={styles.avatarWrap}>
            <div style={styles.avatarLarge}>S</div>
          </div>
          <h2 style={styles.name}>Owner</h2>
          <p style={styles.role}>Pemilik / Admin</p>
          <div style={styles.badge}>Akun Aktif</div>
        </section>

        <section style={styles.detailCard}>
          <h3 style={styles.sectionTitle}>Detail Akun</h3>
          <div style={styles.detailList}>
            <div style={styles.detailItem}>
              <User size={16} color="#6E6A64" />
              <span style={styles.detailLabel}>Nama</span>
              <span style={styles.detailValue}>Owner Suma</span>
            </div>
            <div style={styles.detailItem}>
              <Mail size={16} color="#6E6A64" />
              <span style={styles.detailLabel}>Email</span>
              <span style={styles.detailValue}>owner@suma.com</span>
            </div>
            <div style={styles.detailItem}>
              <Phone size={16} color="#6E6A64" />
              <span style={styles.detailLabel}>Telepon</span>
              <span style={styles.detailValue}>0812-3456-7890</span>
            </div>
            <div style={styles.detailItem}>
              <MapPin size={16} color="#6E6A64" />
              <span style={styles.detailLabel}>Cabang</span>
              <span style={styles.detailValue}>Suma Barbershop - Cabang Utama</span>
            </div>
            <div style={styles.detailItem}>
              <Shield size={16} color="#6E6A64" />
              <span style={styles.detailLabel}>Role</span>
              <span style={styles.detailValue}>Owner</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '20px 24px 24px', color: '#142D22' },
  header: { marginBottom: 24 },
  title: { margin: 0, fontFamily: 'var(--font-heading)', fontSize: 30, fontWeight: 700, color: '#123526' },
  subtitle: { margin: '7px 0 0', color: '#6E6A64', fontSize: 14 },
  cardGrid: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' },
  profileCard: { background: 'rgba(255,255,255,0.92)', border: '1px solid #E6D8C6', borderRadius: 13, padding: '32px 24px', textAlign: 'center', boxShadow: '0 14px 34px rgba(85,58,25,0.04)' },
  avatarWrap: { marginBottom: 16 },
  avatarLarge: { width: 72, height: 72, borderRadius: '50%', background: '#1A3325', color: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, margin: '0 auto' },
  name: { margin: 0, fontSize: 20, fontWeight: 700, color: '#10281F', fontFamily: 'var(--font-heading)' },
  role: { margin: '4px 0 12px', color: '#6E6A64', fontSize: 13 },
  badge: { display: 'inline-block', padding: '6px 16px', background: '#EAF6F0', color: '#0F3F31', borderRadius: 20, fontSize: 12, fontWeight: 700 },
  detailCard: { background: 'rgba(255,255,255,0.92)', border: '1px solid #E6D8C6', borderRadius: 13, padding: 24, boxShadow: '0 14px 34px rgba(85,58,25,0.04)' },
  sectionTitle: { margin: '0 0 18px', fontSize: 16, fontWeight: 800, color: '#10281F' },
  detailList: { display: 'flex', flexDirection: 'column', gap: 14 },
  detailItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#F8F4EE', borderRadius: 9 },
  detailLabel: { fontSize: 13, color: '#6E6A64', minWidth: 70 },
  detailValue: { fontSize: 13, fontWeight: 700, color: '#10281F' },
};
