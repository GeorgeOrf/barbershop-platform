"use client"

import { fetchFreeSlots } from "@/lib/actions/fetchFreeSlots";
import { getMonthDays } from "@/lib/calendar";
import { useState, useEffect } from "react";
import { createBooking } from "@/lib/actions/booking"

type Service= {
    id: number;
    name: string;
    description: string | null;
    price:number;
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

export default function BookingForm({services, barbers, closedWeekdays}: BookingFormProps) {

    const [freeSlots, setFreeSlots] = useState<string[]>([]);
    const [barberId, setBarberId] = useState(0);
    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [serviceId, setServiceId] = useState(0);

    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Athens" });
    const dateParts = today.split("-").map(Number);
    const monthDays = getMonthDays(dateParts[0], dateParts[1], today, closedWeekdays);

    useEffect(() => {
        if(barberId === 0 || !date) return;
        fetchFreeSlots(barberId, date).then(setFreeSlots);
    }, [barberId, date]);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;

        if(!serviceId || !barberId || !timeSlot || !date){
            setMessage("Missing fields!");
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
            if(result.success) {
                setMessage("Booking successful");
                setTimeSlot("");
                setBarberId(0);
                setServiceId(0);
                setDate("");
                setFreeSlots([]);
                form.reset();
            } else {
                setMessage(result.error);
                setTimeSlot("");
                fetchFreeSlots(barberId, date).then(setFreeSlots);
            }
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong, please try again!");
        } finally {
            setIsSubmitting(false);
        }
    }
    

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input type="text" name="name" placeholder="Your Name" required />
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" placeholder="Your Email"/>
                <label htmlFor="phone">Phone:</label>
                <input type="tel" name="phone" placeholder="Your Phone Number" required />
    
                <select name="barber"
                    onChange={(e) => { 
                    setBarberId(Number(e.target.value))
                    setTimeSlot("");
                    setFreeSlots([]);
                    }} required >
    
                    <option value="">Select a barber</option>
                    {barbers.map((barber) => {
                        return (
                            <option key={barber.id} value={barber.id}>
                                {barber.name}
                            </option>
                        )
                    })}
                </select>

                <select name="service"
                    onChange={(e) => {
                    setServiceId(Number(e.target.value))
                    }} required>
                    <option value="">Select a service</option>
                    {services.map((service) => {
                        return (
                            <option key={service.id} value={service.id}>
                                {service.name} - {service.price.toFixed(2)}€
                            </option>
                        )
                    })}
                </select>

                <select name="date" value={date} 
                    onChange={(e) => {
                    setDate(e.target.value)
                    setTimeSlot("");
                    setFreeSlots([]);
                }} required>
                    <option value="">Select a date</option>
                        {monthDays.filter((day) => day.selectable)
                        .map((day) => {
                            return (
                                <option key={day.date} value={day.date}>
                                    {day.date}
                                </option>
                            )
                        })}
                </select>

                {barberId !==0 && date && freeSlots.length === 0 && (
                    <p>No free times for this day</p>
                )}

                {freeSlots.map((slot) => {
                    return (
                        <button 
                        type="button"
                        key={slot}
                        onClick={() => setTimeSlot(slot)}
                        className={slot === timeSlot ? "bg-white text-black" : "bg-black text-white"}
                        >{slot}</button>
                    );
                })}

                <button type="submit" disabled={isSubmitting}>Book</button>
                {(message && (
                    <p>{message}</p>
                ))}
            </form>
        </>
    );
}