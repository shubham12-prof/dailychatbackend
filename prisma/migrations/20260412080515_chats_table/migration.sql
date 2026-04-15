-- CreateTable
CREATE TABLE "chats " (
    "id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chats _pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chats _created_at_idx" ON "chats "("created_at");

-- AddForeignKey
ALTER TABLE "chats " ADD CONSTRAINT "chats _group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "chat_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
