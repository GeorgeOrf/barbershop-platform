import { fetchBarbers } from "@/lib/queries/barbers";
import { fetchServices } from "@/lib/queries/services";

export async function getBookingData() {
        const barbers = await fetchBarbers(); 
        const services = await fetchServices();
    
        const plainServices = services.map((service) => ({
            ...service,
            price: Number(service.price),
        }));

        return { barbers, plainServices };
}