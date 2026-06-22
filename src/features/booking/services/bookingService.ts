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
  const slot = BOOKING_SLOTS.find((item) => item.time === input.time);

  if (!service) throw new Error('Layanan booking tidak ditemukan.');
  if (!barber || !barber.available) throw new Error('Barber tidak tersedia untuk booking.');
  if (!slot || slot.status === 'booked') throw new Error('Slot waktu tidak tersedia.');
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
