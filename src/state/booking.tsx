import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { ratePlan, roomType, type RatePlan, type RoomType } from '@/data/catalog';
import { addDays, defaultStay, nightsBetween, quote, today, type Quote, type Stay } from '@/lib/stay';

export type Guest = { firstName: string; lastName: string; email: string; phone: string; country: string };
export type BookingStatus = 'CONFIRMED' | 'CANCELLED';

export type Booking = {
  reference: string;
  createdAt: string;
  status: BookingStatus;
  stay: Stay;
  type: RoomType;
  plan: RatePlan;
  price: Quote;
  guest: Guest;
  arrivalTime?: string;
  specialRequests?: string;
};

export type Tab = 'upcoming' | 'past' | 'cancelled';
export const tabOf = (b: Booking): Tab => (b.status === 'CANCELLED' ? 'cancelled' : b.stay.checkOut <= today() ? 'past' : 'upcoming');
export const freeCancelUntil = (b: Booking) => (b.plan.refundable ? addDays(b.stay.checkIn, -Math.ceil((b.plan.freeCancelHours ?? 0) / 24)) : null);

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newReference = () => `SH-${Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')}`;

/** "sh4qk8tw", "SH 4QK8TW" and "SH-4QK8TW" all mean the same booking. */
export const normalizeRef = (v: string) => {
  const c = v.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return c.startsWith('SH') ? `SH-${c.slice(2)}` : c;
};

const DEMO_GUEST: Guest = { firstName: 'Ali', lastName: 'Raza', email: 'guest@example.com', phone: '+92 300 0000000', country: 'Pakistan' };
const EMPTY_GUEST: Guest = { firstName: '', lastName: '', email: '', phone: '', country: 'Pakistan' };

/** Mock signed-in account (UI only — no backend). */
export type User = { firstName: string; lastName: string; email?: string; phone?: string };

function seed(): Booking[] {
  const make = (ref: string, slug: string, code: string, ci: string, nights: number, status: BookingStatus): Booking => {
    const type = roomType(slug)!;
    const plan = ratePlan(code)!;
    const stay: Stay = { checkIn: ci, checkOut: addDays(ci, nights), adults: 2, children: 0, rooms: 1 };
    return { reference: ref, createdAt: addDays(ci, -21), status, stay, type, plan, price: quote(type, plan, stay), guest: DEMO_GUEST };
  };
  return [
    make('SH-4QK8TW', 'grand-one-bedroom', 'FLEX_BB', addDays(today(), -48), 3, 'CONFIRMED'),
    make('SH-9MR2XC', 'classic-one-bedroom', 'FLEX', addDays(today(), -110), 2, 'CANCELLED'),
  ];
}

type Ctx = {
  stay: Stay;
  setStay: (s: Stay) => void;
  hasSearched: boolean;
  user: User | null;
  signIn: (u: User) => void;
  signOut: () => void;
  bookings: Booking[];
  guest: Guest;
  createBooking: (input: { slug: string; code: string; guest: Guest; arrivalTime?: string; specialRequests?: string }) => Booking;
  cancelBooking: (ref: string) => void;
  /** Find a booking by reference + the email it was made with (the web's "Find a booking"). */
  findBooking: (reference: string, email: string) => Booking | null;
};

const BookingContext = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [stay, setStayState] = useState<Stay>(defaultStay);
  const [hasSearched, setHasSearched] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(seed);
  const [user, setUser] = useState<User | null>(null);
  const [guest, setGuest] = useState<Guest>(EMPTY_GUEST);

  const value = useMemo<Ctx>(
    () => ({
      stay,
      setStay: (s) => {
        setStayState(s);
        setHasSearched(true);
      },
      hasSearched,
      user,
      signIn: (u) => {
        setUser(u);
        setGuest((g) => ({ ...g, firstName: u.firstName, lastName: u.lastName, email: u.email ?? g.email, phone: u.phone ?? g.phone }));
      },
      signOut: () => setUser(null),
      bookings,
      guest,
      createBooking: ({ slug, code, guest: g, arrivalTime, specialRequests }) => {
        const type = roomType(slug)!;
        const plan = ratePlan(code)!;
        const b: Booking = {
          reference: newReference(),
          createdAt: today(),
          status: 'CONFIRMED',
          stay,
          type,
          plan,
          price: quote(type, plan, stay),
          guest: g,
          arrivalTime,
          specialRequests,
        };
        setBookings((cur) => [b, ...cur]);
        setGuest(g);
        return b;
      },
      findBooking: (reference, email) => {
        const ref = normalizeRef(reference);
        const mail = email.trim().toLowerCase();
        return bookings.find((b) => b.reference === ref && b.guest.email.trim().toLowerCase() === mail) ?? null;
      },
      cancelBooking: (ref) => setBookings((cur) => cur.map((b) => (b.reference === ref ? { ...b, status: 'CANCELLED' } : b))),
    }),
    [stay, hasSearched, user, bookings, guest],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
}

export const stayNights = (s: Stay) => nightsBetween(s.checkIn, s.checkOut);
