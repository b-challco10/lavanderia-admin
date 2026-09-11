/*
  Warnings:

  - You are about to drop the column `sucursalId` on the `Usuario` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_sucursalId_fkey";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "sucursalId";
