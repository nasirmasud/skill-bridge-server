-- AlterTable
ALTER TABLE "users" ADD COLUMN     "provider" TEXT,
ADD COLUMN     "socialId" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_socialId_key" ON "users"("provider", "socialId");

