-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "extra_ids" TEXT,
ADD COLUMN     "milk_id" UUID,
ADD COLUMN     "syrup_id" UUID,
ADD COLUMN     "temperature" TEXT,
ADD COLUMN     "volume_ml" INTEGER;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "allow_cold" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "allow_hot" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "cold_surcharge" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hot_surcharge" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "syrups" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "syrups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milks" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "milks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extras" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_sizes" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "volume_ml" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_syrups" (
    "product_id" UUID NOT NULL,
    "syrup_id" UUID NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_syrups_pkey" PRIMARY KEY ("product_id","syrup_id")
);

-- CreateTable
CREATE TABLE "product_milks" (
    "product_id" UUID NOT NULL,
    "milk_id" UUID NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_milks_pkey" PRIMARY KEY ("product_id","milk_id")
);

-- CreateTable
CREATE TABLE "product_extras" (
    "product_id" UUID NOT NULL,
    "extra_id" UUID NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_extras_pkey" PRIMARY KEY ("product_id","extra_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "syrups_name_key" ON "syrups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "milks_name_key" ON "milks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "extras_name_key" ON "extras"("name");

-- CreateIndex
CREATE INDEX "product_sizes_product_id_idx" ON "product_sizes"("product_id");

-- CreateIndex
CREATE INDEX "product_syrups_product_id_idx" ON "product_syrups"("product_id");

-- CreateIndex
CREATE INDEX "product_syrups_syrup_id_idx" ON "product_syrups"("syrup_id");

-- CreateIndex
CREATE INDEX "product_milks_product_id_idx" ON "product_milks"("product_id");

-- CreateIndex
CREATE INDEX "product_milks_milk_id_idx" ON "product_milks"("milk_id");

-- CreateIndex
CREATE INDEX "product_extras_product_id_idx" ON "product_extras"("product_id");

-- CreateIndex
CREATE INDEX "product_extras_extra_id_idx" ON "product_extras"("extra_id");

-- AddForeignKey
ALTER TABLE "product_sizes" ADD CONSTRAINT "product_sizes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_syrups" ADD CONSTRAINT "product_syrups_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_syrups" ADD CONSTRAINT "product_syrups_syrup_id_fkey" FOREIGN KEY ("syrup_id") REFERENCES "syrups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_milks" ADD CONSTRAINT "product_milks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_milks" ADD CONSTRAINT "product_milks_milk_id_fkey" FOREIGN KEY ("milk_id") REFERENCES "milks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_extras" ADD CONSTRAINT "product_extras_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_extras" ADD CONSTRAINT "product_extras_extra_id_fkey" FOREIGN KEY ("extra_id") REFERENCES "extras"("id") ON DELETE CASCADE ON UPDATE CASCADE;
