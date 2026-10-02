import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS
    },
    connectionTimeout: 15000
});

export const sendMail = async (to, sub, msg) => {
    // transporter.sendMail({
    //     to: to,
    //     subject: sub,
    //     html: msg
    // });
    try {
        const info = await transporter.sendMail({
            from: `"TechMitra Support" <${process.env.NODEMAILER_EMAIL}>`,
            to: to,
            subject: sub,
            html: msg
        });
        return info;
    } catch(error) {
        console.error("Nodemailer failed to send email:", error.message);
        console.error("code:", error.code);
        console.error("response:", error.response);
        console.error("responseCode:", error.responseCode);
        throw error;
    }
}
