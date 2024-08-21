import { PrismaClient }  from '@prisma/client'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

function hashPassword(password: string) {
    // hash
    return bcrypt.hashSync(password, 10)
}

async function main() {
    const user = await prisma.user.upsert({
        where: { email: ''},
        update: {},
        create: {
            email: 'seedTest@gmail.com',
            name: 'seedAdmin',
            password: hashPassword('seedAdmin'),
            country: 'Morocco',
            city: 'Casablanca',
            provider: 'Manual',
            role: 'admin',
            phoneNumber: '0606060606',
            image: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg'
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