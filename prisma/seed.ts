import { PrismaClient }  from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.upsert({
        where: { email: 'zogamaouddach@gmail.com' },
        update: {},
        create: {
            email: 'zogamaouddach@gmail.com',
            name: 'Zouhair Ouddach',
            password: 'defaultpassword',
        }
    })
    console.log('User created\n', user)
}

main()
    .then(() => prisma.$disconnect())
    .catch( async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
})
 
//  Now, you can run the seed script using the following command: 
//  npx ts-node prisma/seed.ts
 
//  This will create a user with the email