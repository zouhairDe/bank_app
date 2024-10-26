import { PrismaClient }  from '@prisma/client'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

function hashPassword(password: string) {
    return bcrypt.hashSync(password, 10)
}

async function main() {

	const user = await prisma.user.upsert({
		where: { email: 'seedTest@gmail.com' },
		update: {},
		create: {
			email: 'seedTest@gmail.com',
			name: 'seedAdmin',
			password: hashPassword('seedAdmin'),
			provider: 'Manual',
			role: 'ADMIN',
			phoneNumber: '0606060606',
			image: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg',
			location: 'Khouribga-25000, Morocco',
			balance: 69000,
			gender: "Male",
			isBanned: false,
			isVerified: true,
			phoneNumberVerified: true,
			DataSubmitted: true,
		},
	})

	console.log('User created\n', user)

	const creditCard = await prisma.creditCard.create({
		data: {
			number: '4242-4242-4242-4242',
			expirationDate: new Date(user.createdAt.getFullYear() + 10, user.createdAt.getMonth(), user.createdAt.getDate()), // Expiration date is createdAt + 10 years
			holder: user.name,
			cvv: '222',
			ownerId: user.id,
			isBlocked: false,
		},
	})

	console.log('Credit Card created\n', creditCard)

	const transaction = await prisma.transaction.create({
		data: {
			amount: 1000.0,
			userId: user.id,
			receiverId: user.id, // This represents a self-transfer in this case
		},
	})

	console.log('Transaction created\n', transaction)
}
	
main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
