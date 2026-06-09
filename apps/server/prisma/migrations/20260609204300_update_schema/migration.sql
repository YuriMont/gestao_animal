-- AlterTable
ALTER TABLE "animals" ADD COLUMN     "currentWeight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "births" ADD COLUMN     "inseminationId" TEXT,
ADD COLUMN     "offspringWeight" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "parasite_monitoring" (
    "id" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "famacha" INTEGER,
    "opg" INTEGER,
    "nextParasiteCheck" TIMESTAMP(3),
    "observation" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parasite_monitoring_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "parasite_monitoring" ADD CONSTRAINT "parasite_monitoring_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parasite_monitoring" ADD CONSTRAINT "parasite_monitoring_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "births" ADD CONSTRAINT "births_inseminationId_fkey" FOREIGN KEY ("inseminationId") REFERENCES "inseminations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
