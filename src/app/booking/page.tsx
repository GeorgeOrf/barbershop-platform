
import BookingForm from "@/components/BookingForm";
import { getBookingData } from "./BookingData";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";

async function BookingContent() {
    const { barbers, plainServices, closedWeekdays, closedDays } = await getBookingData();
    return (
    <BookingForm barbers={barbers} services={plainServices} closedWeekdays={closedWeekdays} closedDays={closedDays} />
    )
}

export default function BookingPage() {

    return (
        <div>
            <Navbar/>
            <Suspense fallback={<p>Loading</p>}>
                <BookingContent/>
            </Suspense>
        </div>
    );
}

