/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Barber` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Barber_name_key" ON "Barber"("name");
