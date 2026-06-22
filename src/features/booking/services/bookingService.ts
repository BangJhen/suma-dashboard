export type SlotStatus = 'available' | 'limited' | 'booked';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';

export interface BookingServiceItem {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export interface BarberOption {
  id: string;
  name: string;
  role: string;
  available: boolean;
}

export interface BookingSlot {
  time: string;
  status: SlotStatus;
}

export interface BookingInput {
  customerName: string;
  phone: string;
  serviceId: string;
  barberId: string;
  date: string;
  time: string;
  notes: string;
}

export interface BookingRecord extends BookingInput {
  bookingId: string;
  serviceName: string;
  barberName: string;
  status: BookingStatus;
  createdAt: string;
}

export const BOOKING_BRANCH = 'Suma Barber Malang';

export const BOOKING_SERVICES: BookingServiceItem[] = [
  { id: 'gentlemans-cut', category: 'Haircut', name: "Gentleman's Cut", description: 'Haircut + hairwash + head massage + face mask', price: 40000, durationMinutes: 45 },
  { id: 'perm-cut', category: 'Hairstyling', name: "Perm + Gentleman's Cut", description: 'Perm styling lengkap dengan potong rambut', price: 180000, durationMinutes: 120 },
  { id: 'korean-perm-cut', category: 'Hairstyling', name: "Korean Perm + Gentleman's Cut", description: 'Korean perm premium dengan konsultasi style', price: 310000, durationMinutes: 150 },
  { id: 'down-perm', category: 'Hairstyling', name: 'Down Perm', description: 'Rapikan arah tumbuh rambut samping', price: 120000, durationMinutes: 75 },
  { id: 'full-coloring', category: 'Hair Coloring', name: 'Full Hair Coloring', description: 'Pewarnaan rambut full head', price: 250000, durationMinutes: 150 },
  { id: 'full-bleach', category: 'Hair Coloring', name: 'Full Hair Bleach', description: 'Bleaching full head sebelum warna lanjutan', price: 270000, durationMinutes: 180 },
  { id: 'highlight', category: 'Hair Coloring', name: 'Highlight', description: 'Highlight rambut dengan section pilihan', price: 290000, durationMinutes: 150 },
  { id: 'polish-semir', category: 'Hair Coloring', name: 'Polish (Semir)', description: 'Semir rambut cepat untuk tampilan fresh', price: 90000, durationMinutes: 60 },
];

export const BARBER_OPTIONS: BarberOption[] = [
  { id: 'auto', name: 'Bebas Barber', role: 'Dipilih otomatis oleh admin', available: true },
  { id: 'raka', name: 'Raka', role: 'Senior Barber', available: true },
  { id: 'dimas', name: 'Dimas', role: 'Perm Specialist', available: true },
  { id: 'bayu', name: 'Bayu', role: 'Color Specialist', available: true },
  { id: 'andra', name: 'Andra', role: 'Barber', available: false },
];

export const BOOKING_SLOTS: BookingSlot[] = [
  { time: '10:00', status: 'available' },
  { time: '10:30', status: 'available' },
  { time: '11:00', status: 'limited' },
  { time: '11:30', status: 'booked' },
  { time: '13:00', status: 'available' },
  { time: '13:30', status: 'available' },
  { time: '14:00', status: 'limited' },
  { time: '15:00', status: 'booked' },
  { time: '16:00', status: 'available' },
  { time: '17:00', status: 'available' },
  { time: '19:00', status: 'limited' },
  { time: '20:00', status: 'available' },
];

// ─── Per-Barber Booking Data ─────────────────────────────────────────────────
// Each barber has individual bookings. A slot is only "booked" for a specific
// barber when that barber personally has an appointment at that time.

export interface BarberBookedSlot {
  barberId: string;
  date: string;
  time: string;
}

export const BARBER_BOOKINGS: BarberBookedSlot[] = [
  // Raka – 4 booked slots
  { barberId: 'raka', date: '2026-06-16', time: '10:00' },
  { barberId: 'raka', date: '2026-06-16', time: '11:30' },
  { barberId: 'raka', date: '2026-06-16', time: '14:00' },
  { barberId: 'raka', date: '2026-06-16', time: '17:00' },
  // Dimas – 4 booked slots
  { barberId: 'dimas', date: '2026-06-16', time: '10:30' },
  { barberId: 'dimas', date: '2026-06-16', time: '11:00' },
  { barberId: 'dimas', date: '2026-06-16', time: '13:00' },
  { barberId: 'dimas', date: '2026-06-16', time: '19:00' },
  // Bayu – 4 booked slots
  { barberId: 'bayu', date: '2026-06-16', time: '10:00' },
  { barberId: 'bayu', date: '2026-06-16', time: '13:30' },
  { barberId: 'bayu', date: '2026-06-16', time: '15:00' },
  { barberId: 'bayu', date: '2026-06-16', time: '20:00' },
];

/**
 * Returns time slots filtered by a specific barber's individual availability.
 *
 * - Specific barber: only slots where that barber is NOT booked are returned.
 *   Slots already booked by other barbers are excluded entirely.
 * - "auto" (Bebas Barber): returns slots where at least one active barber
 *   is still available. The slot status reflects the worst-case base status.
 */
export function getSlotsForBarber(
  barberId: string,
  date: string = '2026-06-16',
  slots: BookingSlot[] = BOOKING_SLOTS,
): BookingSlot[] {
  const activeBarberIds = BARBER_OPTIONS
    .filter((barber) => barber.available)
    .map((barber) => barber.id);

  if (barberId === 'auto') {
    // For auto: show slot if at least one active barber is free at that time
    return slots.filter((slot) => {
      if (slot.status === 'booked') return false;
      const bookedBarberIds = BARBER_BOOKINGS
        .filter((b) => b.date === date && b.time === slot.time)
        .map((b) => b.barberId);
      return activeBarberIds.some((id) => !bookedBarberIds.includes(id));
    });
  }

  // For a specific barber: only return slots where THIS barber is not booked
  const barber = BARBER_OPTIONS.find((b) => b.id === barberId);
  if (!barber || !barber.available) return [];

  const ownBookedTimes = new Set(
    BARBER_BOOKINGS
      .filter((b) => b.barberId === barberId && b.date === date)
      .map((b) => b.time),
  );

  return slots.filter((slot) => {
    if (ownBookedTimes.has(slot.time)) return false;
    return true;
  });
}

export function formatBookingPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function isReasonableWhatsappNumber(phone: string) {
  const normalized = phone.replace(/[\s-]/g, '');
  return /^(\+62|62|0)8\d{7,12}$/.test(normalized);
}

export function getAvailableSlots(slots: BookingSlot[] = BOOKING_SLOTS) {
  return slots.filter((slot) => slot.status !== 'booked');
}

export function createBooking(input: BookingInput, createdAt = new Date()): BookingRecord {
  const service = BOOKING_SERVICES.find((item) => item.id === input.serviceId);
  const barber = BARBER_OPTIONS.find((item) => item.id === input.barberId);
  if (!service) throw new Error('Layanan booking tidak ditemukan.');
  if (!barber || !barber.available) throw new Error('Barber tidak tersedia untuk booking.');

  // Validate slot availability for the specific barber
  const availableSlots = getSlotsForBarber(input.barberId, input.date);
  const isSlotAvailable = availableSlots.some((s) => s.time === input.time);
  if (!isSlotAvailable) throw new Error('Slot waktu tidak tersedia untuk barber yang dipilih.');

  if (!input.customerName.trim()) throw new Error('Nama pelanggan wajib diisi.');
  if (!isReasonableWhatsappNumber(input.phone)) throw new Error('Nomor WhatsApp tidak valid.');

  return {
    ...input,
    bookingId: `SBM-${createdAt.getTime().toString(36).toUpperCase()}`,
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    serviceName: service.name,
    barberName: barber.name,
    status: 'pending',
    createdAt: createdAt.toISOString(),
  };
}
