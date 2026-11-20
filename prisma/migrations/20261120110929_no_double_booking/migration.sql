-- This is an empty migration.
CREATE UNIQUE INDEX "Appointment_active_barber_date_key"
ON "Appointment" ("barberId", "date")
WHERE "status" <> 'CANCELLED';