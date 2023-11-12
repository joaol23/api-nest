/*
  Warnings:

  - You are about to drop the column `bithAt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `bithAt`,
    ADD COLUMN `birthAt` DATE NULL;
