"use client"

import { fetchFreeSlots } from "@/lib/actions/fetchFreeSlots";
import { getMonthDays, toDateString } from "@/lib/calendar";
import { useState, useEffect } from "react";
import { createBooking } from "@/lib/actions/booking";

type Service = {
    id: number;
    name: string;
    description: string | null;
    price: number;
    durationMin: number;
};

type Barber = {
    id: number;
    name: string;
    role: string;
    photo: string | null;
};

type BookingFormProps = {
    services: Service[];
    barbers: Barber[];
    closedWeekdays: number[];
};

// Keep in sync with MAX_DAYS_AHEAD in lib/actions/booking.ts
const MAX_DAYS_AHEAD = 30;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function addDays(dateText: string, days: number): string {
    const d = new Date(`${dateText}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-sm text-white">
                    {number}
                </span>
                {title}
            </h2>
            {children}
        </section>
    );
}

const inputClass =
    "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10";

export default function BookingForm({ services, barbers, closedWeekdays }: BookingFormProps) {

    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Athens" });
    const maxDate = addDays(today, MAX_DAYS_AHEAD);
    const todayYear = Number(today.slice(0, 4));
    const todayMonth = Number(today.slice(5, 7));

    const [slotsResult, setSlotsResult] = useState<{ key: string; slots: string[] } | null>(null);
    const [barberId, setBarberId] = useState(0);
    const [serviceId, setServiceId] = useState(0);
    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [view, setView] = useState({ year: todayYear, month: todayMonth });

    const [message, setMessage] = useState("");
    const [messageOk, setMessageOk] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // The free slots always belong to one barber + day (the "key").
    // If the key doesn't match the current choice, the list is simply not shown.
    const slotsKey = `${barberId}|${date}`;
    const slotsReady = slotsResult !== null && slotsResult.key === slotsKey;
    const freeSlots = slotsReady ? slotsResult.slots : [];
    const slotsLoading = barberId !== 0 && date !== "" && !slotsReady;

    const monthDays = getMonthDays(view.year, view.month, today, closedWeekdays);
    const leadingBlanks = monthDays[0].dayOfWeek - 1;

    const monthLabel = new Date(Date.UTC(view.year, view.month - 1, 1)).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    });

    const next = view.month === 12 ? { year: view.year + 1, month: 1 } : { year: view.year, month: view.month + 1 };
    const canGoPrev = view.year * 12 + view.month > todayYear * 12 + todayMonth;
    const canGoNext = toDateString(next.year, next.month, 1) <= maxDate;

    const selectedService = services.find((service) => service.id === serviceId);
    const selectedBarber = barbers.find((barber) => barber.id === barberId);
    const dateLabel = date
        ? new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              timeZone: "UTC",
          })
        : null;

    useEffect(() => {
        if (barberId === 0 || !date) return;
        const key = `${barberId}|${date}`;
        fetchFreeSlots(barberId, date).then((slots) => setSlotsResult({ key, slots }));
    }, [barberId, date]);

    function changeMonth(delta: number) {
        setView((current) => {
            const index = current.year * 12 + (current.month - 1) + delta;
            return { year: Math.floor(index / 12), month: (index % 12) + 1 };
        });
    }

    function selectService(id: number) {
        setServiceId(id);
        setMessage("");
    }

    function selectBarber(id: number) {
        if (id !== barberId) {
            setBarberId(id);
            setTimeSlot("");
        }
        setMessage("");
    }

    function selectDate(day: string) {
        if (day !== date) {
            setDate(day);
            setTimeSlot("");
        }
        setMessage("");
    }

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;

        const missing: string[] = [];
        if (!serviceId) missing.push("a service");
        if (!barberId) missing.push("a barber");
        if (!date) missing.push("a day");
        if (!timeSlot) missing.push("a time");

        if (missing.length > 0) {
            setMessageOk(false);
            setMessage(`Please choose ${missing.join(", ")}.`);
            return;
        }

        const formData = new FormData(form);
        const name = String(formData.get("name"));
        const email = String(formData.get("email"));
        const phone = String(formData.get("phone"));

        setMessage("");
        setIsSubmitting(true);

        try {
            const result = await createBooking(serviceId, barberId, date, timeSlot, name, phone, email);
            if (result.success) {
                setMessageOk(true);
                setMessage("Booking confirmed! See you soon.");
                setTimeSlot("");
                setBarberId(0);
                setServiceId(0);
                setDate("");
                setSlotsResult(null);
                form.reset();
            } else {
                setMessageOk(false);
                setMessage(result.error);
                setTimeSlot("");
                const key = `${barberId}|${date}`;
                fetchFreeSlots(barberId, date).then((slots) => setSlotsResult({ key, slots }));
            }
        } catch (error) {
            console.error(error);
            setMessageOk(false);
            setMessage("Something went wrong, please try again!");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 text-neutral-900 lg:grid-cols-[1fr_22rem]"
        >
            <div className="flex flex-col gap-6">

                <Step number={1} title="Διάλεξε υπηρεσία">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {services.map((service) => {
                            const selected = service.id === serviceId;
                            return (
                                <button
                                    type="button"
                                    key={service.id}
                                    aria-pressed={selected}
                                    onClick={() => selectService(service.id)}
                                    className={`flex items-center justify-between gap-3 rounded-xl p-4 text-left ring-1 transition ${
                                        selected
                                            ? "bg-black text-white ring-black"
                                            : "bg-white ring-neutral-300 hover:ring-black"
                                    }`}
                                >
                                    <span>
                                        <span className="block font-medium">{service.name}</span>
                                        <span className={`block text-sm ${selected ? "text-neutral-300" : "text-neutral-500"}`}>
                                            {service.durationMin} λεπτά
                                        </span>
                                    </span>
                                    <span className="text-lg font-semibold">{service.price.toFixed(2)}€</span>
                                </button>
                            );
                        })}
                    </div>
                </Step>

                <Step number={2} title="Διάλεξε barber">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {barbers.map((barber) => {
                            const selected = barber.id === barberId;
                            return (
                                <button
                                    type="button"
                                    key={barber.id}
                                    aria-pressed={selected}
                                    onClick={() => selectBarber(barber.id)}
                                    className={`flex items-center gap-4 rounded-xl p-4 text-left ring-1 transition ${
                                        selected
                                            ? "bg-black text-white ring-black"
                                            : "bg-white ring-neutral-300 hover:ring-black"
                                    }`}
                                >
                                    {barber.photo ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={barber.photo}
                                            alt={barber.name}
                                            className="h-12 w-12 shrink-0 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span
                                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${
                                                selected ? "bg-white text-black" : "bg-neutral-200 text-neutral-700"
                                            }`}
                                        >
                                            {barber.name.charAt(0)}
                                        </span>
                                    )}
                                    <span className="font-medium">{barber.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </Step>

                <Step number={3} title="Διάλεξε ημέρα">
                    <div className="mx-auto w-full max-w-md">
                        <div className="mb-3 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => changeMonth(-1)}
                                disabled={!canGoPrev}
                                aria-label="Previous month"
                                className="flex h-9 w-9 items-center justify-center rounded-full text-xl ring-1 ring-neutral-300 transition hover:ring-black disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:ring-neutral-300"
                            >
                                ‹
                            </button>
                            <span className="font-semibold">{monthLabel}</span>
                            <button
                                type="button"
                                onClick={() => changeMonth(1)}
                                disabled={!canGoNext}
                                aria-label="Next month"
                                className="flex h-9 w-9 items-center justify-center rounded-full text-xl ring-1 ring-neutral-300 transition hover:ring-black disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:ring-neutral-300"
                            >
                                ›
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center">
                            {WEEKDAYS.map((weekday) => (
                                <span key={weekday} className="py-1 text-xs font-medium uppercase text-neutral-500">
                                    {weekday}
                                </span>
                            ))}

                            {Array.from({ length: leadingBlanks }).map((_, index) => (
                                <span key={`blank-${index}`} />
                            ))}

                            {monthDays.map((day) => {
                                const available = day.selectable && day.date <= maxDate;
                                const selected = day.date === date;
                                const isToday = day.date === today;
                                return (
                                    <button
                                        type="button"
                                        key={day.date}
                                        disabled={!available}
                                        aria-pressed={selected}
                                        onClick={() => selectDate(day.date)}
                                        className={`aspect-square rounded-lg text-sm transition ${
                                            selected
                                                ? "bg-black font-semibold text-white"
                                                : available
                                                  ? "hover:bg-neutral-100"
                                                  : "cursor-not-allowed text-neutral-300 line-through"
                                        } ${isToday && !selected ? "ring-1 ring-black" : ""}`}
                                    >
                                        {Number(day.date.slice(8, 10))}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </Step>

                <Step number={4} title="Διάλεξε ώρα">
                    {barberId === 0 || !date ? (
                        <p className="text-neutral-500">Choose a barber and a day to see the free times.</p>
                    ) : slotsLoading ? (
                        <p className="text-neutral-500">Loading free times...</p>
                    ) : freeSlots.length === 0 ? (
                        <p className="text-neutral-500">No free times for this day.</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                            {freeSlots.map((slot) => (
                                <button
                                    type="button"
                                    key={slot}
                                    aria-pressed={slot === timeSlot}
                                    onClick={() => setTimeSlot(slot)}
                                    className={`rounded-lg py-2.5 text-sm font-medium ring-1 transition ${
                                        slot === timeSlot
                                            ? "bg-black text-white ring-black"
                                            : "bg-white ring-neutral-300 hover:ring-black"
                                    }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    )}
                </Step>

                <Step number={5} title="Τα στοιχεία σου">
                    <p className="text-sm text-gray-500">Χρειαζόμαστε τα στοιχεία σου για λόγους επικοινωνίας και καλύτερης εξυπηρέτησης.</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label htmlFor="name" className="text-sm font-medium">Όνομα</label>
                            <input id="name" type="text" name="name" placeholder="Your name" required className={inputClass} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="phone" className="text-sm font-medium">Τηλέφωνο Επικοινωνίας</label>
                            <input id="phone" type="tel" name="phone" placeholder="69XXXXXXXX" required className={inputClass}
                            inputMode="tel" pattern="[0-9+\s\-]{10,18}" title="Enter a valid phone number"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email <span className="font-normal text-neutral-500">(Προαιρετικό)</span>
                            </label>
                            <input id="email" type="email" name="email" placeholder="you@example.com" className={inputClass} />
                        </div>
                    </div>
                </Step>
            </div>

            <aside className="lg:sticky lg:top-6 lg:self-start">
                <div className="flex flex-col gap-5 rounded-2xl bg-neutral-900 p-6 text-white shadow-lg">
                    <h2 className="text-lg font-semibold">Η κράτηση σου</h2>

                    <dl className="flex flex-col gap-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <dt className="text-neutral-400">Υπηρεσία</dt>
                            <dd className="text-right">{selectedService ? selectedService.name : "—"}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-neutral-400">Barber</dt>
                            <dd className="text-right">{selectedBarber ? selectedBarber.name : "—"}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-neutral-400">Ημέρα</dt>
                            <dd className="text-right">{dateLabel ?? "—"}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-neutral-400">Ώρα</dt>
                            <dd className="text-right">{timeSlot || "—"}</dd>
                        </div>
                    </dl>

                    <div className="flex items-baseline justify-between border-t border-white/15 pt-4">
                        <span className="text-neutral-400">Total</span>
                        <span className="text-2xl font-semibold">
                            {selectedService ? `${selectedService.price.toFixed(2)}€` : "—"}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Booking..." : "Book appointment"}
                    </button>

                    {message && (
                        <p role="status" className={`text-sm ${messageOk ? "text-emerald-300" : "text-red-300"}`}>
                            {message}
                        </p>
                    )}
                </div>
            </aside>
        </form>
    );
}