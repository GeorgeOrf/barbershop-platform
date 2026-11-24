import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentBarber } from "@/lib/get-session";
import { getBookingData } from "@/app/booking/BookingData";
import BookingForm from "@/components/BookingForm";
import { createBookingAsStaff } from "@/lib/actions/appointments";

async function StaffBookingForm() {
    const barber = await getCurrentBarber();

    if (!barber) {
        redirect("/login");
    }

    const { barbers, plainServices, closedWeekdays, closedDays } = await getBookingData();


    return (
            <BookingForm 
                barbers={barbers} 
                services={plainServices} 
                closedWeekdays={closedWeekdays} 
                closedDays={closedDays} 
                submitAction={createBookingAsStaff}
            />
    );
}

export default function NewBookingPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <StaffBookingForm />
        </Suspense>
    );
}