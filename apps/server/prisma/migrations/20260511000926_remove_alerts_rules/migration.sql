/*
  Warnings:

  - You are about to drop the `alert_rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "alert_rules" DROP CONSTRAINT "alert_rules_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_organizationId_fkey";

-- DropTable
DROP TABLE "alert_rules";

-- DropTable
DROP TABLE "notifications";
