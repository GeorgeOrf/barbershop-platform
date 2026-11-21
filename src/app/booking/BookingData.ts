import { fetchBarbers } from "@/lib/queries/barbers";
import { fetchServices } from "@/lib/queries/services";
import { fetchHours } from "@/lib/queries/hours";
import { fetchUpcomingClosedDays } from "@/lib/queries/closedDays";

export async function getBookingData() {
        const barbers = await fetchBarbers(); 
        const services = await fetchServices();
        const hours = await fetchHours();
        const closedDays = await fetchUpcomingClosedDays();
    
        const plainServices = services.map((service) => ({
            ...service,
            price: Number(service.price),
        }));

        const closedWeekdays = hours
        .filter((hour) => hour.open === null)
        .map((hour) => hour.dayOfWeek);

        return { barbers, plainServices, closedWeekdays, closedDays };
}