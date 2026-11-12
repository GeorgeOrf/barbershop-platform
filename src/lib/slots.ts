
function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

const SLOT_MINUTES = 30;

export function generateSlots(open: string, close: string): string[] {
  const slots: string[] = [];
  const start = toMinutes(open);
  const end = toMinutes(close);

  for(let time = start; time + SLOT_MINUTES <= end; time += SLOT_MINUTES) {
    slots.push(toTime(time));
  }

  return slots;
}

export function filterFreeSlots(slots: string[], takenDates: Date[]): string[] {
  const taken = takenDates.map((date) => 
  date.toLocaleTimeString("el-GR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Athens",
  })
  );

   return slots.filter((slot) => !taken.includes(slot));
}
