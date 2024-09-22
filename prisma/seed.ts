import { PrismaClient }  from '@prisma/client'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

function hashPassword(password: string) {
    // hash
    return bcrypt.hashSync(password, 10)
}

async function main() {
    const user = await prisma.user.upsert({
        where: { email: 'seedTest@gmail.com'},
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
	
	const userId = user.userId; 

	if (userId === null) {
	  throw new Error("User ID is null, cannot create post.");
	}
	
	const post = await prisma.posts.upsert({
	  where: {
	    id: 'seed-post-id',
	  },
	  create: {
	    content: 'Hello world',
	    isApproved: true,
	    userId: userId as number,
	  },
	  update: {
	    content: 'Updated content',
	    isApproved: true,
	  },
	});
	console.log('Post created\n', post);
	
	const post2 = await prisma.posts.upsert({
		where: {
			id: 'seed-post-id-2',
		},
		create: {
			content: 'Hello world 2',
			isApproved: true,
			userId: userId as number,
		},
		update: {
			content: 'Updated content 2',
			isApproved: true,
		},
	});
	console.log('Post2 created\n', post2);
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