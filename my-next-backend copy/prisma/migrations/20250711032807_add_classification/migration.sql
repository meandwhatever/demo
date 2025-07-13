-- CreateTable
CREATE TABLE "mbl_Document" (
    "id" SERIAL NOT NULL,
    "file_Url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawJson" JSONB NOT NULL,
    "file_id" TEXT NOT NULL,

    CONSTRAINT "mbl_Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hbl_Document" (
    "id" SERIAL NOT NULL,
    "file_Url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawJson" JSONB NOT NULL,
    "file_id" TEXT NOT NULL,
    "mbl_Number" TEXT NOT NULL,

    CONSTRAINT "hbl_Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "mode" TEXT,
    "mbl_Number" TEXT,
    "mbl_url" TEXT,
    "hbl_Number" TEXT,
    "hbl_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "updated_reason" TEXT,
    "containers" JSONB[],
    "freightCharges" JSONB[],
    "rawJson" JSONB,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hs_code" TEXT NOT NULL,
    "confidence" DECIMAL(65,30) NOT NULL,
    "product_title" TEXT NOT NULL,
    "product_description" TEXT NOT NULL,
    "first_two_digits" TEXT NOT NULL,
    "broader_description" TEXT NOT NULL,

    CONSTRAINT "Classification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mbl_Document_file_id_key" ON "mbl_Document"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "hbl_Document_file_id_key" ON "hbl_Document"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "hbl_Document_mbl_Number_key" ON "hbl_Document"("mbl_Number");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_shipmentId_key" ON "Shipment"("shipmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_hbl_Number_key" ON "Shipment"("hbl_Number");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_hbl_url_key" ON "Shipment"("hbl_url");
