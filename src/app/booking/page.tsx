
import BookingForm from "@/components/BookingForm";
import { getBookingData } from "./BookingData";
import { Suspense } from "react";

async function BookingContent() {
    const { barbers, plainServices, closedWeekdays } = await getBookingData();
    return (
    <BookingForm barbers={barbers} services={plainServices} closedWeekdays={closedWeekdays} />
    )
}

export default function BookingPage() {

    return (
        <div>
            <h1>Booking Page</h1>
            <Suspense fallback={<p>Loading</p>}>
                <BookingContent/>
            </Suspense>
        </div>
    );
}

