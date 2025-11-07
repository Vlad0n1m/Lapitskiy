/*
  Warnings:

  - Changed the type of `slug` on the `categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CategorySlug" AS ENUM ('coffe', 'tea', 'croisant', 'macaroon', 'rahat', 'cheese');

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "slug",
ADD COLUMN     "slug" "CategorySlug" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
