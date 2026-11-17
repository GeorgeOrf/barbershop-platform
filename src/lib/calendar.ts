import { toDate } from "date-fns-tz";



export function daysInMonth(year: number, month: number): number {
   return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function toDateString(year:number, month: number, day: number): string {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export type CalendarDay = {
    date: string;
    dayOfWeek: number;
    selectable: boolean;
}

export function getMonthDays(
    year: number,
    month: number,
    today: string,
    closedWeekdays: number[]
): CalendarDay[] {
    const days: CalendarDay[] = [];
    const total = daysInMonth(year, month);
    
    for(let day = 1; day <= total; day++){
        const date = toDateString(year, month, day);
        const jsDay = new Date(`${date}T12:00:00Z`).getUTCDay();
        const dayOfWeek = jsDay === 0 ? 7 : jsDay;
        const selectable = date >= today && !closedWeekdays.includes(dayOfWeek);

        days.push({date, dayOfWeek, selectable});
    }

    return days;
}
