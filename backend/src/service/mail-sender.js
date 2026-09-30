import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS
    }
});

export const sendMail = async (to, sub, msg) => {
    // transporter.sendMail({
    //     to: to,
    //     subject: sub,
    //     html: msg
    // });
    try {
        const info = await transporter.sendMail({
            from: "TechMitra",
            to: to,
            subject: sub,
            html: msg
        });
        return info;
    } catch(error) {
        console.error("Nodemailer failed to send email:", error.message);
        throw error;
    }
}
