"use client"

import { usePathname, useRouter } from "next/navigation"

export default function DatePicker({ value} : { value: string }) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <input 
            type="date"
            value={value}
            onChange={(e) => {
                if (e.target.value) {
                    router.push(`${pathname}?date=${e.target.value}`);
                }
            }}
            />
    );
}