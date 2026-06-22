import {
  BOOKING_SLOTS,
  createBooking,
  getAvailableSlots,
  isReasonableWhatsappNumber,
} from '../src/features/booking/services/bookingService.js';

function assertEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${String(expected)}, got ${String(actual)}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const booking = createBooking(
  {
    customerName: '  Rizky  ',
    phone: '0812-3456-7890',
    serviceId: 'gentlemans-cut',
    barberId: 'auto',
    date: '2026-06-16',
    time: '10:00',
    notes: 'Datang dari Instagram',
  },
  new Date('2026-06-15T08:00:00.000Z'),
);

assertEqual(booking.status, 'pending', 'new booking starts as pending');
assertEqual(booking.customerName, 'Rizky', 'customer name is trimmed');
assertEqual(booking.serviceName, "Gentleman's Cut", 'service name is copied to booking record');
assertEqual(booking.barberName, 'Bebas Barber', 'auto barber option is supported');
assert(booking.bookingId.startsWith('SBM-'), 'booking id uses Suma Barber Malang prefix');

assert(isReasonableWhatsappNumber('+6281234567890'), 'valid +62 WhatsApp number passes');
assert(!isReasonableWhatsappNumber('12345'), 'short invalid phone fails');
assert(!getAvailableSlots(BOOKING_SLOTS).some((slot) => slot.status === 'booked'), 'available slots exclude booked slots');

let bookedSlotRejected = false;
try {
  createBooking({
    customerName: 'Ari',
    phone: '081234567890',
    serviceId: 'gentlemans-cut',
    barberId: 'auto',
    date: '2026-06-16',
    time: '11:30',
    notes: '',
  });
} catch {
  bookedSlotRejected = true;
}

assert(bookedSlotRejected, 'booked slot cannot be selected');
