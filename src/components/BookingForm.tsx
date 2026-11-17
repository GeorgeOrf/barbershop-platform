"use client"

import { fetchFreeSlots } from "@/lib/actions/fetchFreeSlots";
import { useState } from "react";

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


    

    return (
        <form>
            <label htmlFor="name">Name:</label>
            <input type="text" name="name" placeholder="Your Name" required />
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" placeholder="Your Email" required />
            <label htmlFor="phone">Phone:</label>
            <input type="phone" name="phone" placeholder="Your Phone Number" required />
            <select name="barber" required onChange={(e) => setBarberId(Number(e.target.value))}>
                <option value="">Select a barber</option>
                {barbers.map((barber) =>{
                    return (
                        <option key={barber.id} value={barber.id}>
                            {barber.name}
                        </option>
                    )
                })}
            </select>
            <select name="service" required>
                <option value="">Select a service</option>
                {services.map((service) => {
                    return (
                        <option key={service.id} value={service.id}>
                            {service.name} - {service.price.toFixed(2)}€
                        </option>
                    )
                })}
            </select>
            <select name="date" required>
                <option value="">Select a date</option>
                
            </select>
            <p>{barberId}</p>
            <p>{closedWeekdays.join(",")}</p>
        </form>

    );
}