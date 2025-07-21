-- CreateTable
CREATE TABLE "Palabra" (
    "texto" TEXT NOT NULL,
    "frecuenciaAbsoluta" INTEGER NOT NULL,
    "frecuenciaNorm" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Palabra_pkey" PRIMARY KEY ("texto")
);

-- CreateTable
CREATE TABLE "Word" (
    "name" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("name")
);
