import React, { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Scissors,
  UserCheck,
  UserMinus,
  UserX,
  Users,
  X,
  Eye,
  EyeOff,
  UserCog,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Off';
type ScheduleSlotStatus = 'available' | 'booked' | 'break' | 'off';

interface BarberStaff {
  id: string;
  name: string;
  role: string;
  available: boolean;
  joinDate: string;
  phone: string;
  schedule: { start: string; end: string; breakStart: string; breakEnd: string };
  offDays: number[]; // 0=Sun, 1=Mon ...
}

interface AttendanceRecord {
  barberId: string;
  date: string;
  status: AttendanceStatus;
  clockIn: string;
  clockOut: string;
  totalHours: number;
}

interface DaySchedule {
  barberId: string;
  date: string;
  slots: { time: string; status: ScheduleSlotStatus; label?: string }[];
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const STAFF: BarberStaff[] = [
  {
    id: 'raka', name: 'Raka Pratama', role: 'Senior Barber', available: true,
    joinDate: '12 Jan 2023', phone: '0812-3456-7890',
    schedule: { start: '09:30', end: '21:00', breakStart: '12:00', breakEnd: '13:00' },
    offDays: [0, 6],
  },
  {
    id: 'dimas', name: 'Dimas Saputra', role: 'Perm Specialist', available: true,
    joinDate: '03 Mar 2023', phone: '0813-9876-5432',
    schedule: { start: '10:00', end: '21:00', breakStart: '12:30', breakEnd: '13:30' },
    offDays: [1, 0],
  },
  {
    id: 'bayu', name: 'Bayu Santoso', role: 'Color Specialist', available: true,
    joinDate: '20 Jun 2023', phone: '0821-5555-8888',
    schedule: { start: '10:00', end: '21:00', breakStart: '13:00', breakEnd: '14:00' },
    offDays: [2, 0],
  },
  {
    id: 'andra', name: 'Andra Wijaya', role: 'Barber', available: true,
    joinDate: '08 Sep 2024', phone: '0857-1234-5678',
    schedule: { start: '10:00', end: '21:00', breakStart: '12:00', breakEnd: '13:00' },
    offDays: [3, 0],
  },
  {
    id: 'fajar', name: 'Fajar Ramadhan', role: 'Barber', available: true,
    joinDate: '15 Jan 2024', phone: '0818-2345-6789',
    schedule: { start: '09:30', end: '21:00', breakStart: '12:00', breakEnd: '13:00' },
    offDays: [4, 1],
  },
  {
    id: 'yoga', name: 'Yoga Prasetyo', role: 'Fade Specialist', available: true,
    joinDate: '22 Apr 2024', phone: '0822-3456-7890',
    schedule: { start: '10:00', end: '21:00', breakStart: '13:00', breakEnd: '14:00' },
    offDays: [5, 2],
  },
  {
    id: 'reza', name: 'Reza Maulana', role: 'Barber', available: true,
    joinDate: '01 Jul 2024', phone: '0856-4567-8901',
    schedule: { start: '10:00', end: '21:00', breakStart: '12:30', breakEnd: '13:30' },
    offDays: [1, 3],
  },
  {
    id: 'aldi', name: 'Aldi Nugraha', role: 'Junior Barber', available: true,
    joinDate: '10 Oct 2024', phone: '0819-5678-9012',
    schedule: { start: '10:00', end: '20:00', breakStart: '12:00', breakEnd: '13:00' },
    offDays: [2, 4],
  },
  {
    id: 'gilang', name: 'Gilang Firmansyah', role: 'Beard Specialist', available: true,
    joinDate: '05 Dec 2024', phone: '0838-6789-0123',
    schedule: { start: '09:30', end: '21:00', breakStart: '13:00', breakEnd: '14:00' },
    offDays: [3, 5],
  },
  {
    id: 'ilham', name: 'Ilham Setiawan', role: 'Junior Barber', available: true,
    joinDate: '18 Feb 2025', phone: '0858-7890-1234',
    schedule: { start: '10:00', end: '20:00', breakStart: '12:00', breakEnd: '13:00' },
    offDays: [4, 6],
  },
];

const WEEK_DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const WEEK_DAYS_FULL = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30',
];

// Generate dummy attendance for the last 7 days
function generateAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const statuses: AttendanceStatus[] = ['Hadir', 'Hadir', 'Hadir', 'Hadir', 'Hadir', 'Izin', 'Sakit'];

  STAFF.forEach((barber) => {
    for (let d = 6; d >= 0; d--) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      const dayOfWeek = date.getDay();
      const dateStr = date.toISOString().slice(0, 10);

      if (barber.offDays.includes(dayOfWeek)) {
        records.push({ barberId: barber.id, date: dateStr, status: 'Off', clockIn: '-', clockOut: '-', totalHours: 0 });
        continue;
      }

      const rand = Math.random();
      let status: AttendanceStatus;
      if (rand < 0.82) status = 'Hadir';
      else if (rand < 0.90) status = 'Izin';
      else if (rand < 0.95) status = 'Sakit';
      else status = 'Off';

      if (status === 'Hadir') {
        const clockInHour = 9 + Math.floor(Math.random() * 2);
        const clockInMin = Math.floor(Math.random() * 4) * 15;
        const clockOutHour = 20 + Math.floor(Math.random() * 2);
        const clockOutMin = Math.floor(Math.random() * 4) * 15;
        const clockIn = `${String(clockInHour).padStart(2, '0')}:${String(clockInMin).padStart(2, '0')}`;
        const clockOut = `${String(clockOutHour).padStart(2, '0')}:${String(clockOutMin).padStart(2, '0')}`;
        const totalHours = clockOutHour + clockOutMin / 60 - clockInHour - clockInMin / 60;
        records.push({ barberId: barber.id, date: dateStr, status, clockIn, clockOut, totalHours: Math.round(totalHours * 10) / 10 });
      } else {
        records.push({ barberId: barber.id, date: dateStr, status, clockIn: '-', clockOut: '-', totalHours: 0 });
      }
    }
  });

  return records;
}

const ATTENDANCE_RECORDS = generateAttendance();

// Generate daily schedule slots for a barber on a specific date
function getBarberDaySchedule(barber: BarberStaff, dateStr: string): DaySchedule {
  const date = new Date(dateStr + 'T00:00:00');
  const dayOfWeek = date.getDay();

  const slots = TIME_SLOTS.map((time) => {
    const [h, m] = time.split(':').map(Number);
    const timeNum = h + m / 60;

    const breakStart = parseInt(barber.schedule.breakStart.split(':')[0]) + parseInt(barber.schedule.breakStart.split(':')[1]) / 60;
    const breakEnd = parseInt(barber.schedule.breakEnd.split(':')[0]) + parseInt(barber.schedule.breakEnd.split(':')[1]) / 60;

    if (barber.offDays.includes(dayOfWeek)) {
      return { time, status: 'off' as ScheduleSlotStatus, label: 'Off' };
    }
    if (timeNum >= breakStart && timeNum < breakEnd) {
      return { time, status: 'break' as ScheduleSlotStatus, label: 'Istirahat' };
    }

    // Simulate booked slots with deterministic pseudo-random based on barber+date+time
    const seed = (barber.id.charCodeAt(0) * 31 + date.getDate() * 7 + h * 13 + m) % 10;
    if (seed < 4) {
      return { time, status: 'booked' as ScheduleSlotStatus, label: 'Booking' };
    }
    return { time, status: 'available' as ScheduleSlotStatus };
  });

  return { barberId: barber.id, date: dateStr, slots };
}

// Get week dates from a starting Monday
function getWeekDates(startDate: Date): Date[] {
  const day = startDate.getDay();
  const monday = new Date(startDate);
  monday.setDate(startDate.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BarberStaffPage() {
  const [selectedWeekStart] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(() => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1; // Monday=0
  });
  const [staffFilter, setStaffFilter] = useState<'all' | 'onDuty' | 'off'>('all');

  const weekDates = useMemo(() => {
    const base = new Date(selectedWeekStart);
    base.setDate(base.getDate() + weekOffset * 7);
    return getWeekDates(base);
  }, [selectedWeekStart, weekOffset]);

  const weekLabel = useMemo(() => {
    const first = weekDates[0];
    const last = weekDates[6];
    const fmt = (d: Date) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    return `${fmt(first)} - ${fmt(last)} ${last.getFullYear()}`;
  }, [weekDates]);

  const todayStr = new Date().toISOString().slice(0, 10);

  // KPI calculations
  const kpi = useMemo(() => {
    const totalBarber = STAFF.length;
    const activeBarber = STAFF.filter((s) => s.available).length;
    const todayRecords = ATTENDANCE_RECORDS.filter((r) => r.date === todayStr);
    const hadirToday = todayRecords.filter((r) => r.status === 'Hadir').length;
    const totalWorkingDays = ATTENDANCE_RECORDS.filter((r) => r.status !== 'Off').length;
    const hadirDays = ATTENDANCE_RECORDS.filter((r) => r.status === 'Hadir').length;
    const attendanceRate = totalWorkingDays > 0 ? Math.round((hadirDays / totalWorkingDays) * 100) : 0;
    const totalHours = ATTENDANCE_RECORDS.reduce((s, r) => s + r.totalHours, 0);
    const avgHours = totalWorkingDays > 0 ? Math.round((totalHours / totalWorkingDays) * 10) / 10 : 0;

    return { totalBarber, activeBarber, hadirToday, attendanceRate, avgHours };
  }, [todayStr]);

  // Weekly schedule for selected day
  const selectedDate = weekDates[selectedDayIndex];
  const selectedDateStr = selectedDate ? selectedDate.toISOString().slice(0, 10) : todayStr;

  // Compute on-duty barbers for selected date
  const selectedDayOfWeek = selectedDate ? selectedDate.getDay() : new Date().getDay();
  const todayDayOfWeek = new Date().getDay();

  const onDutyBarbers = useMemo(() =>
    STAFF.filter((b) => b.available && !b.offDays.includes(selectedDayOfWeek)),
    [selectedDayOfWeek],
  );

  const offTodayBarbers = useMemo(() =>
    STAFF.filter((b) => !b.available || b.offDays.includes(selectedDayOfWeek)),
    [selectedDayOfWeek],
  );

  // Staff filter for overview cards
  const filteredStaff = useMemo(() => {
    if (staffFilter === 'onDuty') return STAFF.filter((b) => b.available && !b.offDays.includes(todayDayOfWeek));
    if (staffFilter === 'off') return STAFF.filter((b) => !b.available || b.offDays.includes(todayDayOfWeek));
    return STAFF;
  }, [staffFilter, todayDayOfWeek]);

  const onDutyTodayCount = STAFF.filter((b) => b.available && !b.offDays.includes(todayDayOfWeek)).length;
  const offTodayCount = STAFF.length - onDutyTodayCount;

  // Detail modal barber
  const detailBarber = selectedBarberId ? STAFF.find((s) => s.id === selectedBarberId) : null;
  const detailAttendance = detailBarber ? ATTENDANCE_RECORDS.filter((r) => r.barberId === detailBarber.id) : [];
  const detailSchedule = detailBarber ? getBarberDaySchedule(detailBarber, selectedDateStr) : null;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Staff Barber</h1>
          <p style={styles.subtitle}>Kelola jadwal, kehadiran, dan performa kapster cabang aktif.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <section style={styles.kpiGrid}>
        <KpiCard icon={<Users size={20} />} tone="green" label="Total Barber" value={String(kpi.totalBarber)} note={`${kpi.activeBarber} aktif`} />
        <KpiCard icon={<UserCheck size={20} />} tone="green" label="Hadir Hari Ini" value={String(kpi.hadirToday)} note={`dari ${kpi.activeBarber} barber aktif`} />
        <KpiCard icon={<Calendar size={20} />} tone="gold" label="Tingkat Kehadiran" value={`${kpi.attendanceRate}%`} note="7 hari terakhir" />
        <KpiCard icon={<Clock size={20} />} tone="rust" label="Rata-rata Jam Kerja" value={`${kpi.avgHours} jam`} note="per hari kerja" />
      </section>

      {/* Staff Overview */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Tim Barber</h2>
          <span style={styles.badge}>{STAFF.length} orang</span>
        </div>

        {/* Filter Tabs */}
        <div style={styles.filterRow}>
          <button
            onClick={() => setStaffFilter('all')}
            style={{ ...styles.filterTab, ...(staffFilter === 'all' ? styles.filterTabActive : {}) }}
          >
            <Users size={13} /> Semua ({STAFF.length})
          </button>
          <button
            onClick={() => setStaffFilter('onDuty')}
            style={{ ...styles.filterTab, ...(staffFilter === 'onDuty' ? styles.filterTabActive : {}) }}
          >
            <Eye size={13} /> Bertugas ({onDutyTodayCount})
          </button>
          <button
            onClick={() => setStaffFilter('off')}
            style={{ ...styles.filterTab, ...(staffFilter === 'off' ? styles.filterTabActive : {}) }}
          >
            <EyeOff size={13} /> Off Hari Ini ({offTodayCount})
          </button>
        </div>

        <div style={styles.staffGrid}>
          {filteredStaff.map((barber) => {
            const isOffToday = !barber.available || barber.offDays.includes(todayDayOfWeek);
            const todayRecord = ATTENDANCE_RECORDS.find((r) => r.barberId === barber.id && r.date === todayStr);
            const todayStatus: AttendanceStatus = isOffToday ? 'Off' : (todayRecord?.status ?? 'Hadir');
            const todayAppts = isOffToday ? 0 : getBarberDaySchedule(barber, todayStr).slots.filter((s) => s.status === 'booked').length;

            return (
              <button
                key={barber.id}
                onClick={() => setSelectedBarberId(barber.id)}
                style={{
                  ...styles.staffCard,
                  ...(selectedBarberId === barber.id ? styles.staffCardActive : {}),
                  ...(isOffToday ? styles.staffCardDimmed : {}),
                }}
              >
                <div style={{ ...styles.staffAvatar, ...(isOffToday ? styles.staffAvatarDimmed : {}) }}>
                  <span>{barber.name.charAt(0)}</span>
                </div>
                <div style={styles.staffCardBody}>
                  <strong style={styles.staffName}>{barber.name}</strong>
                  <span style={styles.staffRole}>{barber.role}</span>
                </div>
                <div style={styles.staffMeta}>
                  <AttendanceBadge status={todayStatus} small />
                  {!isOffToday && (
                    <span style={styles.staffAppts}>
                      <Scissors size={10} />
                      {todayAppts}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content: Weekly Schedule + Attendance */}
      <div style={styles.contentGrid}>
        {/* Weekly Schedule Grid */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Jadwal Mingguan</h2>
            <div style={styles.weekNav}>
              <button onClick={() => setWeekOffset((o) => o - 1)} style={styles.weekBtn}><ChevronLeft size={15} /></button>
              <span style={styles.weekLabel}>{weekLabel}</span>
              <button onClick={() => setWeekOffset((o) => o + 1)} style={styles.weekBtn}><ChevronRight size={15} /></button>
            </div>
          </div>

          {/* Day Tabs */}
          <div style={styles.dayTabs}>
            {weekDates.map((date, i) => {
              const isSelected = selectedDayIndex === i;
              const isToday = date.toISOString().slice(0, 10) === todayStr;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDayIndex(i)}
                  style={{
                    ...styles.dayTab,
                    ...(isSelected ? styles.dayTabActive : {}),
                    ...(isToday && !isSelected ? styles.dayTabToday : {}),
                  }}
                >
                  <span style={styles.dayTabLabel}>{WEEK_DAYS[date.getDay()]}</span>
                  <span style={styles.dayTabDate}>{date.getDate()}</span>
                </button>
              );
            })}
          </div>

          {/* Schedule Grid */}
          <div style={styles.scheduleGridWrap}>
            <div style={styles.scheduleGrid}>
              <div style={styles.scheduleHeader}>
                <span style={styles.scheduleTimeCol}>Waktu</span>
                {onDutyBarbers.map((barber) => (
                  <span key={barber.id} style={styles.scheduleBarberCol}>{barber.name.split(' ')[0]}</span>
                ))}
              </div>
              {TIME_SLOTS.map((time) => (
                <div key={time} style={styles.scheduleRow}>
                  <span style={styles.scheduleTimeCell}>{time}</span>
                  {onDutyBarbers.map((barber) => {
                    const schedule = getBarberDaySchedule(barber, selectedDateStr);
                    const slot = schedule.slots.find((s) => s.time === time);
                    const status = slot?.status ?? 'available';
                    return (
                      <div
                        key={barber.id}
                        style={{
                          ...styles.scheduleCell,
                          ...(status === 'booked' ? styles.cellBooked : {}),
                          ...(status === 'break' ? styles.cellBreak : {}),
                          ...(status === 'off' ? styles.cellOff : {}),
                        }}
                        title={`${barber.name} - ${time}: ${slot?.label ?? 'Tersedia'}`}
                      >
                        {status === 'booked' && <Scissors size={10} />}
                        {status === 'break' && <Coffee size={10} />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* On-duty summary */}
          <div style={styles.scheduleSummary}>
            <span style={styles.summaryBadge}>
              <UserCog size={12} />
              {onDutyBarbers.length} barber bertugas
            </span>
            {offTodayBarbers.length > 0 && (
              <span style={styles.summaryMuted}>
                {offTodayBarbers.map((b) => b.name.split(' ')[0]).join(', ')} — off
              </span>
            )}
          </div>

          {/* Legend */}
          <div style={styles.legend}>
            <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: '#DDEFE7' }} /> Tersedia</span>
            <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: '#0F3F31' }} /> Booking</span>
            <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: '#FFF1DA' }} /> Istirahat</span>
            <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: '#F2F2F2' }} /> Off</span>
          </div>
        </section>

        {/* Attendance Table */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Kehadiran 7 Hari Terakhir</h2>
          </div>
          <div style={{ ...styles.tableWrap, maxHeight: 340, overflowY: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, ...styles.thSticky }}>Barber</th>
                  {weekDates.map((date, i) => (
                    <th key={i} style={{ ...styles.th, ...styles.thCenter, ...styles.thSticky }}>
                      {WEEK_DAYS[date.getDay()]}<br />
                      <span style={styles.thDate}>{date.getDate()}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STAFF.map((barber) => (
                  <tr key={barber.id}>
                    <td style={styles.tdName}>
                      <span style={styles.miniAvatar}>{barber.name.charAt(0)}</span>
                      {barber.name.split(' ')[0]}
                    </td>
                    {weekDates.map((date, i) => {
                      const dateStr = date.toISOString().slice(0, 10);
                      const record = ATTENDANCE_RECORDS.find(
                        (r) => r.barberId === barber.id && r.date === dateStr,
                      );
                      const status = record?.status ?? '-';
                      return (
                        <td key={i} style={{ ...styles.td, ...styles.tdCenter }}>
                          <AttendanceBadge status={status as AttendanceStatus} small />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Schedule Management */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Pengaturan Jadwal Kerja</h2>
        </div>
        <div style={{ ...styles.tableWrap, maxHeight: 380, overflowY: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, ...styles.thSticky }}>Barber</th>
                <th style={{ ...styles.th, ...styles.thSticky }}>Role</th>
                <th style={{ ...styles.th, ...styles.thSticky }}>Jam Masuk</th>
                <th style={styles.th}>Jam Pulang</th>
                <th style={styles.th}>Istirahat</th>
                <th style={styles.th}>Hari Off</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {STAFF.map((barber) => (
                <tr key={barber.id}>
                  <td style={styles.tdName}>
                    <span style={styles.miniAvatar}>{barber.name.charAt(0)}</span>
                    <div>
                      <strong>{barber.name}</strong>
                      <div style={styles.tdSub}>{barber.phone}</div>
                    </div>
                  </td>
                  <td style={styles.td}>{barber.role}</td>
                  <td style={styles.td}><span style={styles.timePill}>{barber.schedule.start}</span></td>
                  <td style={styles.td}><span style={styles.timePill}>{barber.schedule.end}</span></td>
                  <td style={styles.td}>
                    <span style={styles.breakPill}>
                      <Coffee size={11} />
                      {barber.schedule.breakStart} - {barber.schedule.breakEnd}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.offDayList}>
                      {barber.offDays.map((d) => (
                        <span key={d} style={styles.offDayBadge}>{WEEK_DAYS_FULL[d]}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    {barber.available
                      ? <span style={styles.statusActive}>Aktif</span>
                      : <span style={styles.statusInactive}>Nonaktif</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detail Modal */}
      {detailBarber && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={styles.modalAvatar}>{detailBarber.name.charAt(0)}</div>
                <div>
                  <h2 style={styles.modalTitle}>{detailBarber.name}</h2>
                  <p style={styles.modalSub}>{detailBarber.role} • Bergabung {detailBarber.joinDate}</p>
                </div>
              </div>
              <button onClick={() => setSelectedBarberId(null)} style={styles.modalClose}><X size={18} /></button>
            </div>

            {/* Detail Schedule for selected day */}
            {detailSchedule && (
              <div style={styles.detailSection}>
                <h3 style={styles.detailTitle}>
                  <Calendar size={14} color="#C75B3A" />
                  Jadwal {WEEK_DAYS_FULL[selectedDate.getDay()]}, {selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                </h3>
                <div style={styles.detailSlotGrid}>
                  {detailSchedule.slots.map((slot) => (
                    <div
                      key={slot.time}
                      style={{
                        ...styles.detailSlot,
                        ...(slot.status === 'booked' ? styles.detailSlotBooked : {}),
                        ...(slot.status === 'break' ? styles.detailSlotBreak : {}),
                        ...(slot.status === 'off' ? styles.detailSlotOff : {}),
                      }}
                    >
                      <strong>{slot.time}</strong>
                      <span>{slot.status === 'booked' ? 'Booking' : slot.status === 'break' ? 'Istirahat' : slot.status === 'off' ? 'Off' : 'Tersedia'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attendance summary */}
            <div style={styles.detailSection}>
              <h3 style={styles.detailTitle}>
                <UserCheck size={14} color="#C75B3A" />
                Riwayat Kehadiran
              </h3>
              <div style={styles.detailAttendanceList}>
                {detailAttendance.slice(0, 7).map((record) => {
                  const dateObj = new Date(record.date + 'T00:00:00');
                  return (
                    <div key={record.date} style={styles.detailAttendanceRow}>
                      <span style={styles.detailAttDate}>
                        {WEEK_DAYS_FULL[dateObj.getDay()]}, {dateObj.getDate()} {dateObj.toLocaleDateString('id-ID', { month: 'short' })}
                      </span>
                      <AttendanceBadge status={record.status} />
                      <span style={styles.detailAttHours}>
                        {record.totalHours > 0 ? `${record.totalHours} jam` : '-'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({ icon, tone, label, value, note }: { icon: React.ReactNode; tone: 'green' | 'gold' | 'rust'; label: string; value: string; note: string }) {
  const iconBg = tone === 'green' ? '#0F3F31' : tone === 'gold' ? '#F4D9A4' : '#C75B3A';
  const iconColor = tone === 'green' || tone === 'rust' ? '#fff' : '#B97818';
  return (
    <div style={styles.kpiCard}>
      <span style={{ ...styles.kpiIcon, background: iconBg, color: iconColor }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <p style={styles.kpiLabel}>{label}</p>
        <strong style={styles.kpiValue}>{value}</strong>
        <span style={styles.kpiNote}>{note}</span>
      </div>
    </div>
  );
}

function AttendanceBadge({ status, small }: { status: AttendanceStatus | string; small?: boolean }) {
  const badgeStyle =
    status === 'Hadir' ? styles.badgeHadir :
    status === 'Izin' ? styles.badgeIzin :
    status === 'Sakit' ? styles.badgeSakit :
    status === 'Off' ? styles.badgeOff :
    styles.badgeDefault;
  return (
    <span style={{
      ...styles.attBadge,
      ...badgeStyle,
      ...(small ? styles.attBadgeSmall : {}),
    }}>
      {status === 'Hadir' && <CheckCircle2 size={small ? 10 : 11} />}
      {status === 'Izin' && <UserMinus size={small ? 10 : 11} />}
      {status === 'Sakit' && <UserX size={small ? 10 : 11} />}
      {status}
    </span>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '20px 24px 24px', color: '#142D22', display: 'flex', flexDirection: 'column', gap: 14 },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 },
  title: { margin: 0, fontFamily: 'var(--font-heading)', fontSize: 30, color: '#123526', fontWeight: 700 },
  subtitle: { margin: '7px 0 0', fontSize: 14, color: '#6E6A64' },

  // KPI
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 },
  kpiCard: { minHeight: 96, background: 'rgba(255,255,255,0.9)', border: '1px solid #E6D8C6', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 13, boxShadow: '0 12px 34px rgba(85,58,25,0.04)' },
  kpiIcon: { width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  kpiLabel: { fontSize: 12, color: '#6E6A64', marginBottom: 3, whiteSpace: 'nowrap' },
  kpiValue: { display: 'block', fontSize: 20, color: '#10281F', whiteSpace: 'nowrap' },
  kpiNote: { display: 'block', marginTop: 4, fontSize: 11, color: '#81786F' },

  // Cards
  card: { background: 'rgba(255,255,255,0.92)', border: '1px solid #E6D8C6', borderRadius: 13, padding: 18, boxShadow: '0 14px 34px rgba(85,58,25,0.04)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginBottom: 14 },
  cardTitle: { margin: 0, fontSize: 17, fontWeight: 800, color: '#10281F' },
  badge: { background: '#FFF1DA', color: '#B97818', borderRadius: 999, padding: '5px 10px', fontSize: 11, fontWeight: 800 },

  // Filter tabs
  filterRow: { display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' },
  filterTab: {
    display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8,
    border: '1px solid #E6D8C6', background: '#fff', color: '#6E6A64', fontSize: 12, fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
  },
  filterTabActive: { background: '#0F3F31', color: '#fff', borderColor: '#0F3F31' },

  // Staff overview grid — compact horizontal cards
  staffGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 },
  staffCard: {
    border: '1px solid #E6D8C6', borderRadius: 10, background: '#FFFDF9', padding: '10px 12px',
    display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
    cursor: 'pointer', outline: 'none', transition: 'all 0.15s',
  },
  staffCardActive: { borderColor: '#0F3F31', boxShadow: '0 0 0 2px rgba(15,63,49,0.12)', background: '#F9F6EF' },
  staffCardDimmed: { opacity: 0.55, background: '#F8F8F6' },
  staffAvatar: {
    width: 36, height: 36, borderRadius: '50%', background: '#0F3F31', color: '#F4D9A4',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, flexShrink: 0,
  },
  staffAvatarDimmed: { background: '#A8A29E', color: '#fff' },
  staffCardBody: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 },
  staffName: { fontSize: 12, color: '#10281F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  staffRole: { fontSize: 10, color: '#81786F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  staffMeta: { display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 },
  staffAppts: { display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#6E6A64', fontWeight: 700 },

  // Attendance badges
  attBadge: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, fontSize: 10, fontWeight: 800 },
  attBadgeSmall: { fontSize: 9, padding: '2px 6px' },
  badgeHadir: { background: '#DDEFE7', color: '#0F3F31' },
  badgeIzin: { background: '#FFF1DA', color: '#B97818' },
  badgeSakit: { background: '#FBE2DA', color: '#C75B3A' },
  badgeOff: { background: '#F2F2F2', color: '#888' },
  badgeDefault: { background: '#F2F2F2', color: '#888' },

  // Content grid
  contentGrid: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 14, alignItems: 'start' },

  // Week navigation
  weekNav: { display: 'flex', alignItems: 'center', gap: 8 },
  weekBtn: { width: 32, height: 32, borderRadius: 8, border: '1px solid #E6D8C6', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#10281F' },
  weekLabel: { fontSize: 12, fontWeight: 800, color: '#10281F', minWidth: 140, textAlign: 'center' },

  // Day tabs
  dayTabs: { display: 'flex', gap: 6, marginBottom: 14 },
  dayTab: {
    flex: 1, height: 52, borderRadius: 10, border: '1px solid #E6D8C6', background: '#fff',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
    cursor: 'pointer', transition: 'all 0.15s',
  },
  dayTabActive: { background: '#0F3F31', color: '#fff', borderColor: '#0F3F31' },
  dayTabToday: { borderColor: '#C75B3A', borderWidth: 2 },
  dayTabLabel: { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 },
  dayTabDate: { fontSize: 14, fontWeight: 800 },

  // Schedule grid — scrollable
  scheduleGridWrap: { maxHeight: 400, overflowY: 'auto', borderRadius: 10, border: '1px solid #E6D8C6' },
  scheduleGrid: { minWidth: 0 },
  scheduleHeader: { display: 'flex', background: '#FBF3E8', borderBottom: '1px solid #E6D8C6', position: 'sticky', top: 0, zIndex: 2 },
  scheduleTimeCol: { width: 56, flexShrink: 0, padding: '8px 6px', fontSize: 10, fontWeight: 800, color: '#6E6A64', textAlign: 'center' },
  scheduleBarberCol: { flex: 1, minWidth: 64, padding: '8px 4px', fontSize: 10, fontWeight: 800, color: '#10281F', textAlign: 'center' },
  scheduleRow: { display: 'flex', borderBottom: '1px solid #F0E6D8' },
  scheduleTimeCell: { width: 56, flexShrink: 0, padding: '5px 6px', fontSize: 10, color: '#81786F', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  scheduleCell: {
    flex: 1, minWidth: 64, minHeight: 26, margin: 2, borderRadius: 4, background: '#DDEFE7',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F3F31',
  },
  cellBooked: { background: '#0F3F31', color: '#fff' },
  cellBreak: { background: '#FFF1DA', color: '#B97818' },
  cellOff: { background: '#F2F2F2', color: '#bbb' },

  // Schedule summary
  scheduleSummary: { display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, flexWrap: 'wrap' },
  summaryBadge: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, background: '#DDEFE7', color: '#0F3F31', fontSize: 11, fontWeight: 800 },
  summaryMuted: { fontSize: 11, color: '#81786F' },

  // Legend
  legend: { display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6E6A64' },
  legendDot: { width: 10, height: 10, borderRadius: 3, display: 'inline-block' },

  // Table
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 12 },
  th: { background: '#FBF3E8', padding: '10px 8px', textAlign: 'left', color: '#4E4944', fontWeight: 800, whiteSpace: 'nowrap', borderBottom: '1px solid #E6D8C6' },
  thSticky: { position: 'sticky', top: 0, zIndex: 1, background: '#FBF3E8' },
  thCenter: { textAlign: 'center' },
  thDate: { fontSize: 10, color: '#81786F', fontWeight: 700 },
  td: { padding: '12px 10px', borderBottom: '1px solid #F0E6D8', color: '#10281F', verticalAlign: 'middle' },
  tdName: { padding: '12px 10px', borderBottom: '1px solid #F0E6D8', color: '#10281F', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' },
  tdSub: { fontSize: 10, color: '#81786F', fontWeight: 400, marginTop: 2 },
  miniAvatar: { width: 26, height: 26, borderRadius: '50%', background: '#0F3F31', color: '#F4D9A4', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 },

  // Schedule management
  timePill: { display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 8, background: '#DDEFE7', color: '#0F3F31', fontSize: 12, fontWeight: 800 },
  breakPill: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, background: '#FFF1DA', color: '#B97818', fontSize: 11, fontWeight: 800 },
  offDayList: { display: 'flex', gap: 4, flexWrap: 'wrap' },
  offDayBadge: { padding: '3px 8px', borderRadius: 6, background: '#F2F2F2', color: '#666', fontSize: 10, fontWeight: 700 },
  statusActive: { display: 'inline-flex', padding: '4px 12px', borderRadius: 999, background: '#DDEFE7', color: '#0F3F31', fontSize: 11, fontWeight: 800 },
  statusInactive: { display: 'inline-flex', padding: '4px 12px', borderRadius: 999, background: '#FBE2DA', color: '#C75B3A', fontSize: 11, fontWeight: 800 },

  // Modal
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(15,31,24,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 },
  modalCard: { width: '100%', maxWidth: 580, maxHeight: '85vh', overflowY: 'auto', background: '#fff', borderRadius: 16, border: '1px solid #E7DCCB', padding: 26, boxShadow: '0 24px 80px rgba(15,31,24,0.28)' },
  modalHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 },
  modalAvatar: { width: 52, height: 52, borderRadius: '50%', background: '#0F3F31', color: '#F4D9A4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, flexShrink: 0 },
  modalTitle: { margin: 0, fontSize: 20, color: '#10281F', fontFamily: 'var(--font-heading)' },
  modalSub: { margin: '4px 0 0', fontSize: 12, color: '#81786F' },
  modalClose: { width: 34, height: 34, borderRadius: 999, background: '#F8F4EE', color: '#1A3325', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', flexShrink: 0 },

  // Detail sections
  detailSection: { marginBottom: 20, paddingTop: 16, borderTop: '1px solid #F0E6D8' },
  detailTitle: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 800, color: '#10281F', margin: '0 0 12px' },

  // Detail slot grid
  detailSlotGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 6 },
  detailSlot: {
    border: '1px solid #E6D8C6', borderRadius: 8, padding: '8px 6px', textAlign: 'center',
    background: '#DDEFE7', color: '#0F3F31', fontSize: 11,
  },
  detailSlotBooked: { background: '#0F3F31', color: '#fff', borderColor: '#0F3F31' },
  detailSlotBreak: { background: '#FFF1DA', color: '#B97818', borderColor: '#E6D8C6' },
  detailSlotOff: { background: '#F2F2F2', color: '#999', borderColor: '#E6D8C6' },

  // Detail attendance
  detailAttendanceList: { display: 'flex', flexDirection: 'column', gap: 6 },
  detailAttendanceRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#F8F4EE', borderRadius: 8, fontSize: 12 },
  detailAttDate: { fontWeight: 700, color: '#10281F', minWidth: 130 },
  detailAttHours: { color: '#6E6A64', fontSize: 11 },
};
