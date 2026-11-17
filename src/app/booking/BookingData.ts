import { fetchBarbers } from "@/lib/queries/barbers";
import { fetchServices } from "@/lib/queries/services";
import { fetchHours } from "@/lib/queries/hours";

export async function getBookingData() {
        const barbers = await fetchBarbers(); 
        const services = await fetchServices();
        const hours = await fetchHours();
    
        const plainServices = services.map((service) => ({
            ...service,
            price: Number(service.price),
        }));

        const closedWeekdays = hours
        .filter((hour) => hour.open === null)
        .map((hour) => hour.dayOfWeek);

        return { barbers, plainServices, closedWeekdays };
}