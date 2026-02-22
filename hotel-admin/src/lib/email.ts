import nodemailer from 'nodemailer';
import { prisma } from './prisma';

// Use ethereal mail by default if no real SMTP is provided in .env
let transporter: nodemailer.Transporter | null = null;

export const getTransporter = async () => {
    if (transporter) return transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Fallback to ethereal for testing locally
        const testAccount = await nodemailer.createTestAccount();
        console.log('Created Ethereal Test Account:', testAccount.user);
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
    }

    return transporter;
};

export const sendReservationEmail = async (email: string, name: string, roomType: string, checkIn: string, checkOut: string) => {
    try {
        const trans = await getTransporter();

        const template = await prisma.emailTemplate.findUnique({
            where: { type: 'Reservation' }
        });

        // Use custom template if exists, else fallback to hardcoded
        let htmlBody = `
            <h2>Booking Confirmation - Wilmer House</h2>
            <p>Dear ${name},</p>
            <p>Thank you for choosing to stay with us at Wilmer House.</p>
            <p>We are delighted to confirm your reservation for a <b>${roomType}</b> arriving on <b>${checkIn}</b> and departing on <b>${checkOut}</b>.</p>
            <p>IMPORTANT: For your security and to speed up your check-in process, please upload a secure copy of your Photo ID using this secure portal link: <a href="http://localhost:3000/">Link to Secure ID Portal</a></p>
            <p>If you have any questions or require special accommodations during your stay, please reply directly to this email.</p>
            <p>Warm regards,<br>The Wilmer House Hotel Team</p>
        `;
        let subject = "Booking Confirmation - Wilmer House";

        if (template) {
            subject = template.subject;
            htmlBody = template.body
                .replace(/{{name}}/g, name)
                .replace(/{{room}}/g, roomType)
                .replace(/{{checkIn}}/g, checkIn)
                .replace(/{{checkOut}}/g, checkOut)
                .replace(/\n/g, '<br>');
        }

        const info = await trans.sendMail({
            from: '"Wilmer House Hotel" <reservations@wilmerhouse.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: htmlBody.replace(/<[^>]+>/g, ''), // plain text body
            html: htmlBody, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        if (!process.env.SMTP_HOST) {
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }

        return true;
    } catch (e) {
        console.error("Error sending email:", e);
        return false;
    }
}
