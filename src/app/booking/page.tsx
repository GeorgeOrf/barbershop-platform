
import BookingForm from "@/components/BookingForm";
import { getBookingData } from "./BookingData";

export default function BookingPage() {
    const { barbers, plainServices } = await getBookingData();

    return (
        <div>
            <h1>Booking Page</h1>
            <BookingForm barbers={barbers} services={plainServices} />
            <p>{barbers.length} barbers available</p>
            <p>{plainServices.length} services available</p>
        </div>
    );
}