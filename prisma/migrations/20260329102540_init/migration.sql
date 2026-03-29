-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('GOOGLE_SHEET');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "guid" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accessToken" VARCHAR(255),
    "refreshToken" VARCHAR(255),
    "lastLoginAt" VARCHAR(255),
    "createdAt" VARCHAR(255),
    "updatedAt" VARCHAR(255),
    "deletedAt" VARCHAR(255),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id","guid")
);

-- CreateTable
CREATE TABLE "sheet" (
    "id" SERIAL NOT NULL,
    "guid" UUID NOT NULL,
    "sheetId" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" VARCHAR(255),
    "updatedAt" VARCHAR(255),
    "deletedAt" VARCHAR(255),
    "user_id" INTEGER NOT NULL,
    "user_guid" UUID NOT NULL,

    CONSTRAINT "sheet_pkey" PRIMARY KEY ("id","guid")
);

-- CreateTable
CREATE TABLE "campaign" (
    "id" SERIAL NOT NULL,
    "guid" UUID NOT NULL,
    "title" TEXT,
    "type" TEXT,
    "status" TEXT,
    "createdAt" VARCHAR(255),
    "updatedAt" VARCHAR(255),
    "deletedAt" VARCHAR(255),
    "user_id" INTEGER NOT NULL,
    "user_guid" UUID NOT NULL,

    CONSTRAINT "campaign_pkey" PRIMARY KEY ("id","guid")
);

-- CreateTable
CREATE TABLE "email_template" (
    "id" SERIAL NOT NULL,
    "guid" UUID NOT NULL,
    "title" TEXT,
    "body" VARCHAR(255) NOT NULL,
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" VARCHAR(255),
    "updatedAt" VARCHAR(255),
    "deletedAt" VARCHAR(255),
    "user_id" INTEGER NOT NULL,
    "user_guid" UUID NOT NULL,

    CONSTRAINT "email_template_pkey" PRIMARY KEY ("id","guid")
);

-- CreateTable
CREATE TABLE "campaign_email_template" (
    "id" SERIAL NOT NULL,
    "guid" UUID NOT NULL,
    "title" TEXT,
    "body" VARCHAR(255) NOT NULL,
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" VARCHAR(255),
    "updatedAt" VARCHAR(255),
    "deletedAt" VARCHAR(255),
    "campaign_id" INTEGER NOT NULL,
    "campaign_guid" UUID NOT NULL,
    "email_template_id" INTEGER NOT NULL,
    "email_template_guid" UUID NOT NULL,

    CONSTRAINT "campaign_email_template_pkey" PRIMARY KEY ("id","guid")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" SERIAL NOT NULL,
    "guid" UUID NOT NULL,
    "type" "ContactType" NOT NULL DEFAULT 'GOOGLE_SHEET',
    "name" TEXT,
    "email" TEXT NOT NULL,
    "meta" VARCHAR(255),
    "createdAt" VARCHAR(255),
    "updatedAt" VARCHAR(255),
    "deletedAt" VARCHAR(255),
    "user_id" INTEGER NOT NULL,
    "user_guid" UUID NOT NULL,
    "sheet_id" INTEGER NOT NULL,
    "sheet_guid" UUID NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id","guid")
);

-- CreateTable
CREATE TABLE "sheet_campaign" (
    "id" SERIAL NOT NULL,
    "guid" UUID NOT NULL,
    "title" TEXT,
    "type" TEXT,
    "status" TEXT,
    "createdAt" VARCHAR(255),
    "updatedAt" VARCHAR(255),
    "deletedAt" VARCHAR(255),
    "campaign_id" INTEGER NOT NULL,
    "campaign_guid" UUID NOT NULL,
    "sheet_id" INTEGER NOT NULL,
    "sheet_guid" UUID NOT NULL,

    CONSTRAINT "sheet_campaign_pkey" PRIMARY KEY ("id","guid")
);

-- CreateTable
CREATE TABLE "send_email_history" (
    "id" SERIAL NOT NULL,
    "guid" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sendedAt" VARCHAR(255),
    "createdAt" VARCHAR(255),
    "updatedAt" VARCHAR(255),
    "deletedAt" VARCHAR(255),
    "email_template_id" INTEGER NOT NULL,
    "email_template_guid" UUID NOT NULL,
    "contact_id" INTEGER NOT NULL,
    "contact_guid" UUID NOT NULL,
    "campaign_email_template_id" INTEGER NOT NULL,
    "campaign_email_template_guid" UUID NOT NULL,

    CONSTRAINT "send_email_history_pkey" PRIMARY KEY ("id","guid")
);

-- AddForeignKey
ALTER TABLE "sheet" ADD CONSTRAINT "sheet_user_id_user_guid_fkey" FOREIGN KEY ("user_id", "user_guid") REFERENCES "user"("id", "guid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_user_id_user_guid_fkey" FOREIGN KEY ("user_id", "user_guid") REFERENCES "user"("id", "guid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_template" ADD CONSTRAINT "email_template_user_id_user_guid_fkey" FOREIGN KEY ("user_id", "user_guid") REFERENCES "user"("id", "guid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_email_template" ADD CONSTRAINT "campaign_email_template_campaign_id_campaign_guid_fkey" FOREIGN KEY ("campaign_id", "campaign_guid") REFERENCES "campaign"("id", "guid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_email_template" ADD CONSTRAINT "campaign_email_template_email_template_id_email_template_g_fkey" FOREIGN KEY ("email_template_id", "email_template_guid") REFERENCES "email_template"("id", "guid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_user_id_user_guid_fkey" FOREIGN KEY ("user_id", "user_guid") REFERENCES "user"("id", "guid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_sheet_id_sheet_guid_fkey" FOREIGN KEY ("sheet_id", "sheet_guid") REFERENCES "sheet"("id", "guid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheet_campaign" ADD CONSTRAINT "sheet_campaign_campaign_id_campaign_guid_fkey" FOREIGN KEY ("campaign_id", "campaign_guid") REFERENCES "campaign"("id", "guid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheet_campaign" ADD CONSTRAINT "sheet_campaign_sheet_id_sheet_guid_fkey" FOREIGN KEY ("sheet_id", "sheet_guid") REFERENCES "sheet"("id", "guid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "send_email_history" ADD CONSTRAINT "send_email_history_email_template_id_email_template_guid_fkey" FOREIGN KEY ("email_template_id", "email_template_guid") REFERENCES "email_template"("id", "guid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "send_email_history" ADD CONSTRAINT "send_email_history_contact_id_contact_guid_fkey" FOREIGN KEY ("contact_id", "contact_guid") REFERENCES "contact"("id", "guid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "send_email_history" ADD CONSTRAINT "send_email_history_campaign_email_template_id_campaign_ema_fkey" FOREIGN KEY ("campaign_email_template_id", "campaign_email_template_guid") REFERENCES "campaign_email_template"("id", "guid") ON DELETE RESTRICT ON UPDATE CASCADE;
