-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_id_fkey" FOREIGN KEY ("id") REFERENCES "creditCard"("ownerId") ON DELETE RESTRICT ON UPDATE CASCADE;
