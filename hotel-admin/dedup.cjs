const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    // 1. nullify empty strings
    console.log("Fixing empty strings...");
    await prisma.$executeRaw`UPDATE Guest SET phone = NULL WHERE phone = ''`;
    await prisma.$executeRaw`UPDATE Guest SET email = NULL WHERE email = ''`;

    // 2. find duplicates
    const guests = await prisma.guest.groupBy({
        by: ['phone'],
        having: { phone: { _count: { gt: 1 } } }
    });

    console.log("Found duplicate phones:", guests);

    // 3. delete or nullify duplicate phones
    for (const g of guests) {
        if (!g.phone) continue;
        const all = await prisma.guest.findMany({ where: { phone: g.phone } });
        // Keep the first one, nullify the rest
        for (let i = 1; i < all.length; i++) {
            await prisma.guest.update({
                where: { id: all[i].id },
                data: { phone: null }
            });
            console.log(`Nullified duplicate phone for guest ${all[i].id}`);
        }
    }

    // Do the same for email just in case
    const guestsEmail = await prisma.guest.groupBy({
        by: ['email'],
        having: { email: { _count: { gt: 1 } } }
    });

    console.log("Found duplicate emails:", guestsEmail);

    for (const g of guestsEmail) {
        if (!g.email) continue;
        const all = await prisma.guest.findMany({ where: { email: g.email } });
        for (let i = 1; i < all.length; i++) {
            // we should ideally delete the record if it has no reservations, but nullifying email gets past the unique constraint
            await prisma.guest.update({
                where: { id: all[i].id },
                data: { email: null }
            });
            console.log(`Nullified duplicate email for guest ${all[i].id}`);
        }
    }
}

run().catch(console.error).finally(() => prisma.$disconnect());
