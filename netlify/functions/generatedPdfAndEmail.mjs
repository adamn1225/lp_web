import { PDFDocument, rgb } from 'pdf-lib';
import { createTransport } from 'nodemailer';

export async function handler(event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    const { firstName, lastName, email, phone, guests, pets, dateRange, totalAccommodationFare, cleaningFee, managementFee, totalBeforeTax, totalAfterTax, termsAccepted } = JSON.parse(event.body);

    if (!firstName || !lastName || !email || !phone || !dateRange || !termsAccepted) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'All fields are required and terms must be accepted.' }),
        };
    }

    try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);

        // Add text to the PDF
        page.drawText(`Booking Details`, { x: 50, y: 350, size: 20, color: rgb(0, 0, 0) });
        page.drawText(`First Name: ${firstName}`, { x: 50, y: 320, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Last Name: ${lastName}`, { x: 50, y: 300, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Email: ${email}`, { x: 50, y: 280, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Phone: ${phone}`, { x: 50, y: 260, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Number of Guests: ${guests}`, { x: 50, y: 240, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Number of Pets: ${pets}`, { x: 50, y: 220, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Check-in Date: ${new Date(dateRange[0].startDate).toLocaleDateString()}`, { x: 50, y: 200, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Check-out Date: ${new Date(dateRange[0].endDate).toLocaleDateString()}`, { x: 50, y: 180, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Accommodation Fare: ${totalAccommodationFare}`, { x: 50, y: 160, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Cleaning Fee: ${cleaningFee}`, { x: 50, y: 140, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Management Fee: ${managementFee}`, { x: 50, y: 120, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Total Before Taxes: ${totalBeforeTax}`, { x: 50, y: 100, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Total After Taxes: ${totalAfterTax}`, { x: 50, y: 80, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Terms Accepted: ${termsAccepted ? 'Yes' : 'No'}`, { x: 50, y: 60, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y: 40, size: 12, color: rgb(0, 0, 0) });

        // Serialize the PDF document to bytes
        const pdfBytes = await pdfDoc.save();

        // Create a nodemailer transporter
        const transporter = createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_USER,
                clientId: process.env.G_CLIENT_ID,
                clientSecret: process.env.G_CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
            },
        });

        // Send the email with the PDF attachment
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.RECIPIENT_EMAIL,
            subject: 'Booking Details',
            text: 'Please find attached the booking details.',
            attachments: [
                {
                    filename: 'booking-details.pdf',
                    content: pdfBytes,
                    contentType: 'application/pdf',
                },
            ],
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully!' }),
        };
    } catch (error) {
        console.error('Error generating PDF or sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        };
    }
}