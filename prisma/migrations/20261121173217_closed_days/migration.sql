-- CreateTable
CREATE TABLE "ClosedDay" (
    "id" SERIAL NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "barberId" INTEGER,
    "reason" TEXT,

    CONSTRAINT "ClosedDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClosedDay_startDate_idx" ON "ClosedDay"("startDate");

-- AddForeignKey
ALTER TABLE "ClosedDay" ADD CONSTRAINT "ClosedDay_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE SET NULL ON UPDATE CASCADE;
