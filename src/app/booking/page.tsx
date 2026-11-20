
import BookingForm from "@/components/BookingForm";
import { getBookingData } from "./BookingData";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function BookingContent() {
    const { barbers, plainServices, closedWeekdays } = await getBookingData();
    return (
    <BookingForm barbers={barbers} services={plainServices} closedWeekdays={closedWeekdays} />
    )
}

export default function BookingPage() {

    return (
        <div>
            <Navbar/>
            <Suspense fallback={<p>Loading</p>}>
                <BookingContent/>
            </Suspense>
            <Footer/>
        </div>
    );
}

