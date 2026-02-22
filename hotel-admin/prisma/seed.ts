const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@hotel.com',
            role: 'Admin',
        },
    })

    const room = await prisma.room.create({
        data: {
            number: '101',
            type: 'Suite',
            pricePerNight: 200,
        },
    })

    const guest = await prisma.guest.create({
        data: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '+1 555-555-5555',
        },
    })

    await prisma.reservation.create({
        data: {
            guestId: guest.id,
            roomId: room.id,
            checkIn: new Date(),
            checkOut: new Date(Date.now() + 86400000 * 3), // 3 days
            totalAmount: 600,
        },
    })

    console.log('Seeded SQLite Database!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
