import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendReservationEmail } from '@/lib/email';

export async function GET() {
    try {
        const reservations = await prisma.reservation.findMany({
            include: { guest: true, room: true },
            orderBy: { checkIn: 'asc' }
        });
        return NextResponse.json(reservations);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // 1. First find or create the guest
        let guest;

        if (data.isBlock) {
            guest = await prisma.guest.findFirst({ where: { email: 'maintenance@system.local' } });
            if (!guest) {
                guest = await prisma.guest.create({
                    data: { firstName: 'System', lastName: 'Maintenance', email: 'maintenance@system.local', phone: '000000', address: 'Internal' }
                });
            }
        } else {
            guest = await prisma.guest.findFirst({ where: { email: data.email } });
            if (!guest) {
                guest = await prisma.guest.create({
                    data: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phone: data.phone,
                        address: data.address
                    }
                });
            }
        }
        // 2. Process potentially multiple rooms for large parties
        const roomQty = Math.max(1, data.roomQty || 1);
        const createdReservations = [];

        for (let i = 0; i < roomQty; i++) {
            let room;
            if (data.isBlock && data.roomId) {
                room = await prisma.room.findUnique({ where: { id: data.roomId } });
                if (!room) throw new Error("Room not found for block");
            } else {
                const availableRooms = await prisma.room.findMany({ where: { type: data.roomType } });
                room = availableRooms[i % availableRooms.length]; // Naive spread

                // fallback if no room matches at all
                if (!room) {
                    room = await prisma.room.create({
                        data: { number: `TBD-${Date.now().toString().slice(-4)}-${i}`, type: data.roomType, pricePerNight: 100 }
                    });
                }
            }

            const res = await prisma.reservation.create({
                data: {
                    guestId: guest.id,
                    roomId: room.id,
                    checkIn: new Date(data.checkIn),
                    checkOut: new Date(data.checkOut),
                    status: data.isBlock ? 'Blocked' : 'Confirmed',
                    notes: data.notes || '',
                    adults: data.adults ? parseInt(data.adults.toString()) : 1,
                    children: data.children ? parseInt(data.children.toString()) : 0,
                    totalAmount: data.isBlock ? 0 : (room.pricePerNight * ((new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / (1000 * 60 * 60 * 24)) || room.pricePerNight)
                },
                include: { guest: true, room: true }
            });
            createdReservations.push(res);

            // Send confirmation email asynchronously (do not block standard flow if err)
            if (!data.isBlock && guest.email) {
                sendReservationEmail(guest.email, `${guest.firstName} ${guest.lastName}`, room.type, res.checkIn.toLocaleDateString(), res.checkOut.toLocaleDateString()).catch(console.error);
            }
        }

        return NextResponse.json(createdReservations[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Failed to create reservation' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const res = await prisma.reservation.update({
            where: { id: data.id },
            data: {
                status: data.status,
                paymentStatus: data.paymentStatus,
                notes: data.notes !== undefined ? data.notes : undefined
            }
        });
        return NextResponse.json(res);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Failed to update reservation' }, { status: 500 });
    } // added close bracket for try-catch but forgot error catch
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 });
        }

        await prisma.reservation.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete reservation' }, { status: 500 });
    }
}
