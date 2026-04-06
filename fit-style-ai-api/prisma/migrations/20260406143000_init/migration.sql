-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F', 'UNISEX');

-- CreateEnum
CREATE TYPE "Season" AS ENUM ('SPRING', 'SUMMER', 'FALL', 'WINTER');

-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('TOP', 'BOTTOM', 'OUTER', 'SHOES');

-- CreateTable
CREATE TABLE "BodyType" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "labelKo" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BodyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" BIGSERIAL NOT NULL,
    "category" "ItemCategory" NOT NULL,
    "gender" "Gender" NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "silhouetteTags" JSONB,
    "bmiMin" DOUBLE PRECISION,
    "bmiMax" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutfitSet" (
    "id" BIGSERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "season" "Season",
    "topId" BIGINT NOT NULL,
    "bottomId" BIGINT NOT NULL,
    "outerId" BIGINT,
    "shoesId" BIGINT NOT NULL,
    "bmiMin" DOUBLE PRECISION,
    "bmiMax" DOUBLE PRECISION,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "summaryKo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutfitSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationLog" (
    "id" BIGSERIAL NOT NULL,
    "userRef" TEXT,
    "heightCm" INTEGER NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "bodyTypeId" INTEGER NOT NULL,
    "bmi" DOUBLE PRECISION NOT NULL,
    "outfitSetIds" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ItemBodyTypes" (
    "A" INTEGER NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_ItemBodyTypes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OutfitBodyTypes" (
    "A" INTEGER NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_OutfitBodyTypes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "BodyType_code_key" ON "BodyType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "OutfitSet_code_key" ON "OutfitSet"("code");

-- CreateIndex
CREATE INDEX "_ItemBodyTypes_B_index" ON "_ItemBodyTypes"("B");

-- CreateIndex
CREATE INDEX "_OutfitBodyTypes_B_index" ON "_OutfitBodyTypes"("B");

-- AddForeignKey
ALTER TABLE "OutfitSet" ADD CONSTRAINT "OutfitSet_topId_fkey" FOREIGN KEY ("topId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutfitSet" ADD CONSTRAINT "OutfitSet_bottomId_fkey" FOREIGN KEY ("bottomId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutfitSet" ADD CONSTRAINT "OutfitSet_outerId_fkey" FOREIGN KEY ("outerId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutfitSet" ADD CONSTRAINT "OutfitSet_shoesId_fkey" FOREIGN KEY ("shoesId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationLog" ADD CONSTRAINT "RecommendationLog_bodyTypeId_fkey" FOREIGN KEY ("bodyTypeId") REFERENCES "BodyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemBodyTypes" ADD CONSTRAINT "_ItemBodyTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "BodyType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemBodyTypes" ADD CONSTRAINT "_ItemBodyTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OutfitBodyTypes" ADD CONSTRAINT "_OutfitBodyTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "BodyType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OutfitBodyTypes" ADD CONSTRAINT "_OutfitBodyTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "OutfitSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
