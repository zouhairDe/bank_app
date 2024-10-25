1-
npm init -y                       
npm install prisma typescript ts-node @types/node --save-dev

2-npx tsc --init                    

3-npx prisma

4-npx prisma init

5-npx prisma migrate dev --name init

6-npx prisma generate

7-npx prisma db seed *This seeds the database with infos for the users table in case there is none*

/* how to login in psql:
                        psql -h localhost -d mydatabase -U myuser -p <port>
                        "\dt": shows u all tables in psql;
                        "DELET * FROM "table_name" ": to delete data from a table
*/