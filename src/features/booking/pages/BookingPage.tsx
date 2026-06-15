import React, { useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Instagram,
  MapPin,
  MessageCircle,
  Scissors,
  Sparkles,
  UserRound,
} from 'lucide-react';
import {
  BARBER_OPTIONS,
  BOOKING_BRANCH,
  BOOKING_SERVICES,
  BOOKING_SLOTS,
  createBooking,
  formatBookingPrice,
  getAvailableSlots,
  isReasonableWhatsappNumber,
  type BookingRecord,
} from '../services/bookingService';

const DATE_OPTIONS = [
  { value: '2026-06-16', label: 'Selasa', day: '16 Jun' },
  { value: '2026-06-17', label: 'Rabu', day: '17 Jun' },
  { value: '2026-06-18', label: 'Kamis', day: '18 Jun' },
  { value: '2026-06-19', label: 'Jumat', day: '19 Jun' },
  { value: '2026-06-20', label: 'Sabtu', day: '20 Jun' },
];

export default function BookingPage() {
  const [selectedServiceId, setSelectedServiceId] = useState(BOOKING_SERVICES[0].id);
  const [selectedDate, setSelectedDate] = useState(DATE_OPTIONS[0].value);
  const [selectedTime, setSelectedTime] = useState(getAvailableSlots()[0]?.time ?? '');
  const [selectedBarberId, setSelectedBarberId] = useState('auto');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [successBooking, setSuccessBooking] = useState<BookingRecord | null>(null);

  const selectedService = useMemo(
    () => BOOKING_SERVICES.find((service) => service.id === selectedServiceId) ?? BOOKING_SERVICES[0],
    [selectedServiceId],
  );
  const selectedBarber = useMemo(
    () => BARBER_OPTIONS.find((barber) => barber.id === selectedBarberId) ?? BARBER_OPTIONS[0],
    [selectedBarberId],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('Nama pelanggan wajib diisi.');
      return;
    }

    if (!isReasonableWhatsappNumber(phone)) {
      setError('Nomor WhatsApp belum valid. Gunakan format 08xx atau +628xx.');
      return;
    }

    try {
      const booking = createBooking({
        customerName,
        phone,
        serviceId: selectedServiceId,
        barberId: selectedBarberId,
        date: selectedDate,
        time: selectedTime,
        notes,
      });
      setSuccessBooking(booking);
    } catch (bookingError) {
      setError(bookingError instanceof Error ? bookingError.message : 'Booking gagal dibuat.');
    }
  };

  if (successBooking) {
    return (
      <div style={styles.page}>
        <section style={styles.successShell}>
          <div style={styles.successCard}>
            <span style={styles.successIcon}><CheckCircle2 size={34} /></span>
            <p style={styles.eyebrow}>Booking pending</p>
            <h1 style={styles.successTitle}>Permintaan booking terkirim.</h1>
            <p style={styles.successCopy}>
              Tim Suma Barber Malang akan menghubungi WhatsApp kamu untuk konfirmasi manual. Tidak ada deposit atau pembayaran online pada tahap ini.
            </p>
            <div style={styles.successSummary}>
              <SummaryLine label="ID Booking" value={successBooking.bookingId} />
              <SummaryLine label="Nama" value={successBooking.customerName} />
              <SummaryLine label="Layanan" value={successBooking.serviceName} />
              <SummaryLine label="Barber" value={successBooking.barberName} />
              <SummaryLine label="Jadwal" value={`${successBooking.date} • ${successBooking.time}`} />
              <SummaryLine label="Status" value={successBooking.status} highlight />
            </div>
            <button onClick={() => setSuccessBooking(null)} style={styles.primaryButton}>Buat Booking Lain</button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.heroMedia}>
          <img src="/suma-barbershop-image.PNG" alt="Suma Barbershop interior" style={styles.heroImage} />
          <div style={styles.heroOverlay} />
          <img src="/Logo Suma Barbershop.png" alt="Suma Barbershop" style={styles.heroLogo} />
        </div>
        <div style={styles.heroContent}>
          <p style={styles.eyebrow}><Instagram size={14} /> Booking publik</p>
          <h1 style={styles.heroTitle}>Suma Barber Malang</h1>
          <p style={styles.heroText}>Pilih layanan, tanggal, jam, dan barber favoritmu. Booking masuk sebagai pending lalu dikonfirmasi manual via WhatsApp.</p>
          <div style={styles.heroMeta}>
            <span><MapPin size={14} /> Cabang Malang</span>
            <span><Clock3 size={14} /> 10:00 - 21:00</span>
          </div>
        </div>
      </header>

      <main style={styles.contentGrid}>
        <section style={styles.leftColumn}>
          <section style={styles.card}>
            <SectionHeader icon={<Scissors size={18} />} title="Pilih Layanan" caption="Pricelist Suma Barber Malang ditampilkan sejak awal." />
            <div style={styles.priceImageWrap}>
              <img src="/pricelist-suma-malang.png" alt="Pricelist Suma Barber Malang" style={styles.priceImage} />
            </div>
            <div style={styles.serviceGrid}>
              {BOOKING_SERVICES.map((service) => {
                const isSelected = selectedServiceId === service.id;
                return (
                  <button
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    style={{ ...styles.serviceCard, ...(isSelected ? styles.serviceCardActive : {}) }}
                  >
                    <span style={styles.serviceCategory}>{service.category}</span>
                    <strong style={styles.serviceName}>{service.name}</strong>
                    <span style={styles.serviceDesc}>{service.description}</span>
                    <span style={styles.serviceFooter}>
                      <b>{formatBookingPrice(service.price)}</b>
                      <span>{service.durationMinutes} menit</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section style={styles.card}>
            <SectionHeader icon={<CalendarDays size={18} />} title="Pilih Jadwal" caption="Slot dummy tersedia untuk simulasi booking MVP." />
            <div style={styles.dateGrid}>
              {DATE_OPTIONS.map((date) => (
                <button
                  key={date.value}
                  onClick={() => setSelectedDate(date.value)}
                  style={{ ...styles.dateButton, ...(selectedDate === date.value ? styles.dateButtonActive : {}) }}
                >
                  <strong>{date.label}</strong>
                  <span>{date.day}</span>
                </button>
              ))}
            </div>
            <div style={styles.slotGrid}>
              {BOOKING_SLOTS.map((slot) => {
                const isBooked = slot.status === 'booked';
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    disabled={isBooked}
                    onClick={() => setSelectedTime(slot.time)}
                    style={{
                      ...styles.slotButton,
                      ...(isSelected ? styles.slotButtonActive : {}),
                      ...(isBooked ? styles.slotButtonDisabled : {}),
                    }}
                  >
                    <strong>{slot.time}</strong>
                    <span>{slot.status === 'available' ? 'Tersedia' : slot.status === 'limited' ? 'Terbatas' : 'Penuh'}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section style={styles.card}>
            <SectionHeader icon={<UserRound size={18} />} title="Pilih Barber" caption="Pilih nama barber atau gunakan opsi bebas barber." />
            <div style={styles.barberGrid}>
              {BARBER_OPTIONS.map((barber) => (
                <button
                  key={barber.id}
                  disabled={!barber.available}
                  onClick={() => setSelectedBarberId(barber.id)}
                  style={{
                    ...styles.barberCard,
                    ...(selectedBarberId === barber.id ? styles.barberCardActive : {}),
                    ...(!barber.available ? styles.barberCardDisabled : {}),
                  }}
                >
                  <span style={styles.barberAvatar}>{barber.name.charAt(0)}</span>
                  <strong>{barber.name}</strong>
                  <span>{barber.available ? barber.role : 'Tidak tersedia'}</span>
                </button>
              ))}
            </div>
          </section>
        </section>

        <aside style={styles.bookingPanel}>
          <form onSubmit={handleSubmit} style={styles.formCard}>
            <SectionHeader icon={<MessageCircle size={18} />} title="Data Booking" caption="Nomor WhatsApp diisi manual tanpa OTP." compact />
            <label style={styles.field}>
              <span>Nama pelanggan</span>
              <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} style={styles.input} placeholder="Contoh: Rizky A." />
            </label>
            <label style={styles.field}>
              <span>Nomor WhatsApp</span>
              <input value={phone} onChange={(event) => setPhone(event.target.value)} style={styles.input} placeholder="08xx atau +628xx" />
            </label>
            <label style={styles.field}>
              <span>Catatan opsional</span>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} style={styles.textarea} placeholder="Contoh: ingin low fade, datang dari IG..." />
            </label>

            <div style={styles.summaryBox}>
              <SummaryLine label="Cabang" value={BOOKING_BRANCH} />
              <SummaryLine label="Layanan" value={selectedService.name} />
              <SummaryLine label="Harga" value={formatBookingPrice(selectedService.price)} />
              <SummaryLine label="Jadwal" value={`${selectedDate} • ${selectedTime}`} />
              <SummaryLine label="Barber" value={selectedBarber.name} />
              <SummaryLine label="Status awal" value="pending" highlight />
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}
            <button type="submit" style={styles.primaryButton}><Sparkles size={16} /> Konfirmasi Booking</button>
          </form>
        </aside>
      </main>
    </div>
  );
}

function SectionHeader({ icon, title, caption, compact }: { icon: React.ReactNode; title: string; caption: string; compact?: boolean }) {
  return (
    <div style={{ ...styles.sectionHeader, ...(compact ? styles.sectionHeaderCompact : {}) }}>
      <span style={styles.sectionIcon}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <h2 style={styles.sectionTitle}>{title}</h2>
        <p style={styles.sectionCaption}>{caption}</p>
      </div>
    </div>
  );
}

function SummaryLine({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={styles.summaryLine}>
      <span>{label}</span>
      <strong style={highlight ? styles.summaryHighlight : undefined}>{value}</strong>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { height: '100dvh', overflowY: 'auto', background: '#F5F0E8', color: '#10281F', fontFamily: 'var(--font-body)', padding: 14 },
  hero: { minHeight: 430, borderRadius: 18, overflow: 'hidden', position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', marginBottom: 14, boxShadow: '0 22px 60px rgba(15,63,49,0.2)' },
  heroMedia: { position: 'absolute', inset: 0 },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(8,42,32,0.94), rgba(15,63,49,0.7), rgba(15,63,49,0.24))' },
  heroLogo: { position: 'absolute', right: 22, top: 22, width: 112, height: 'auto', objectFit: 'contain' },
  heroContent: { position: 'relative', zIndex: 1, maxWidth: 680, padding: '76px 28px 42px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  eyebrow: { display: 'inline-flex', alignItems: 'center', gap: 7, margin: '0 0 12px', color: '#F4D9A4', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.6 },
  heroTitle: { margin: 0, fontFamily: 'var(--font-heading)', fontSize: 42, lineHeight: 1.05, color: '#fff' },
  heroText: { margin: '14px 0 0', maxWidth: 560, color: 'rgba(255,255,255,0.86)', fontSize: 15, lineHeight: 1.7 },
  heroMeta: { display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 20 },
  contentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 14, alignItems: 'start' },
  leftColumn: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 },
  card: { background: 'rgba(255,255,255,0.94)', border: '1px solid #E6D8C6', borderRadius: 14, padding: 16, boxShadow: '0 14px 34px rgba(85,58,25,0.05)' },
  sectionHeader: { display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
  sectionHeaderCompact: { marginBottom: 12 },
  sectionIcon: { width: 36, height: 36, borderRadius: 10, background: '#FBF3E8', color: '#C75B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sectionTitle: { margin: 0, fontFamily: 'var(--font-heading)', fontSize: 18, color: '#10281F' },
  sectionCaption: { margin: '4px 0 0', color: '#81786F', fontSize: 12, lineHeight: 1.45 },
  priceImageWrap: { borderRadius: 12, border: '1px solid #E6D8C6', overflow: 'hidden', background: '#0F3F31', marginBottom: 12 },
  priceImage: { width: '100%', height: 'auto', objectFit: 'contain', display: 'block', aspectRatio: '3/4' },
  serviceGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 },
  serviceCard: { minHeight: 146, border: '1px solid #E6D8C6', borderRadius: 12, background: '#FFFDF9', padding: 13, color: '#10281F', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6 },
  serviceCardActive: { borderColor: '#0F3F31', boxShadow: '0 0 0 2px rgba(15,63,49,0.12)', background: '#F9F6EF' },
  serviceCategory: { color: '#C75B3A', fontSize: 11, fontWeight: 900, textTransform: 'uppercase' },
  serviceName: { fontSize: 14, lineHeight: 1.35 },
  serviceDesc: { color: '#81786F', fontSize: 12, lineHeight: 1.4, flex: 1 },
  serviceFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, color: '#0F3F31', fontSize: 12 },
  dateGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(92px, 1fr))', gap: 8, marginBottom: 12 },
  dateButton: { height: 64, borderRadius: 11, border: '1px solid #E6D8C6', background: '#FFFDF9', color: '#10281F', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 },
  dateButtonActive: { background: '#0F3F31', color: '#fff', borderColor: '#0F3F31' },
  slotGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(86px, 1fr))', gap: 8 },
  slotButton: { minHeight: 54, borderRadius: 10, border: '1px solid #E6D8C6', background: '#FFFDF9', color: '#10281F', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 },
  slotButtonActive: { background: '#0F3F31', color: '#fff', borderColor: '#0F3F31' },
  slotButtonDisabled: { opacity: 0.42, cursor: 'not-allowed', textDecoration: 'line-through' },
  barberGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(118px, 1fr))', gap: 9 },
  barberCard: { minHeight: 112, borderRadius: 12, border: '1px solid #E6D8C6', background: '#FFFDF9', color: '#10281F', padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, textAlign: 'center' },
  barberCardActive: { background: '#0F3F31', color: '#fff', borderColor: '#0F3F31' },
  barberCardDisabled: { opacity: 0.45, cursor: 'not-allowed' },
  barberAvatar: { width: 34, height: 34, borderRadius: '50%', background: '#F4D9A4', color: '#0F3F31', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 },
  bookingPanel: { position: 'sticky', top: 14, minWidth: 0 },
  formCard: { background: 'rgba(255,255,255,0.96)', border: '1px solid #E6D8C6', borderRadius: 14, padding: 16, boxShadow: '0 18px 46px rgba(85,58,25,0.08)' },
  field: { display: 'flex', flexDirection: 'column', gap: 6, color: '#4E4944', fontSize: 12, fontWeight: 900, marginBottom: 10 },
  input: { height: 42, borderRadius: 9, border: '1px solid #E6D8C6', background: '#FFFDF9', padding: '0 12px', outline: 'none', fontFamily: 'var(--font-body)', color: '#10281F' },
  textarea: { minHeight: 84, borderRadius: 9, border: '1px solid #E6D8C6', background: '#FFFDF9', padding: 12, outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', color: '#10281F' },
  summaryBox: { borderRadius: 12, background: '#FBF3E8', border: '1px solid #E6D8C6', padding: 12, margin: '12px 0' },
  summaryLine: { display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(230,216,198,0.8)', color: '#6E6A64', fontSize: 12 },
  summaryHighlight: { color: '#C75B3A', textTransform: 'uppercase' },
  errorBox: { borderRadius: 9, background: '#FBE2DA', color: '#C75B3A', padding: '10px 12px', fontSize: 12, fontWeight: 800, marginBottom: 10 },
  primaryButton: { width: '100%', height: 44, borderRadius: 10, background: '#0F3F31', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 900, boxShadow: '0 15px 28px rgba(15,63,49,0.22)' },
  successShell: { minHeight: 'calc(100vh - 28px)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'linear-gradient(rgba(15,63,49,0.82), rgba(15,63,49,0.92)), url("/suma-barbershop-image.PNG")', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 18, padding: 18 },
  successCard: { width: '100%', maxWidth: 560, background: '#fff', borderRadius: 18, border: '1px solid #E6D8C6', padding: 24, boxShadow: '0 24px 70px rgba(0,0,0,0.2)' },
  successIcon: { width: 64, height: 64, borderRadius: '50%', background: '#EAF6F0', color: '#0F3F31', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  successTitle: { margin: 0, fontFamily: 'var(--font-heading)', fontSize: 30, color: '#10281F' },
  successCopy: { color: '#6E6A64', lineHeight: 1.6, fontSize: 14, margin: '10px 0 14px' },
  successSummary: { borderRadius: 12, border: '1px solid #E6D8C6', padding: 12, marginBottom: 14 },
};
