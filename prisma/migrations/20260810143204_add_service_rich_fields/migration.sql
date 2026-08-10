-- AlterTable
ALTER TABLE "services" ADD COLUMN     "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "packageFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "packageName" TEXT,
ADD COLUMN     "tools" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "whatYouGet" TEXT[] DEFAULT ARRAY[]::TEXT[];
