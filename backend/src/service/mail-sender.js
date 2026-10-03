// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     family: 4,
//     auth: {
//         user: process.env.NODEMAILER_EMAIL,
//         pass: process.env.NODEMAILER_PASS
//     },
// });

// export const sendMail = async (to, sub, msg) => {
//     // transporter.sendMail({
//     //     to: to,
//     //     subject: sub,
//     //     html: msg
//     // });
//     try {
//         const info = await transporter.sendMail({
//             from: `"TechMitra Support" <${process.env.NODEMAILER_EMAIL}>`,
//             to: to,
//             subject: sub,
//             html: msg
//         });
//         return info;
//     } catch(error) {
//         console.error("Nodemailer failed to send email:", error.message);
//         console.error("code:", error.code);
//         console.error("response:", error.response);
//         console.error("responseCode:", error.responseCode);
//         throw error;
//     }
// }
import nodemailer from "nodemailer";
import dns from "dns";

const resolveGmailIPv4 = () => {
    return new Promise((resolve, reject) => {
        dns.resolve4("smtp.gmail.com", (error, addresses) => {
            if (error) {
                reject(error);
            } else {
                resolve(addresses[0]);
            }
        });
    });
};

export const sendMail = async (to, sub, msg) => {
    try {
        const gmailIPv4 = await resolveGmailIPv4();

        console.log("Gmail IPv4:", gmailIPv4);

        const transporter = nodemailer.createTransport({
            host: gmailIPv4,
            port: 587,
            secure: false,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASS
            }
        });

        const info = await transporter.sendMail({
            from: `"TechMitra Support" <${process.env.NODEMAILER_EMAIL}>`,
            to,
            subject: sub,
            html: msg
        });

        return info;

    } catch (error) {
        console.error("Nodemailer failed to send email:", error.message);
        console.error("code:", error.code);
        console.error("response:", error.response);
        console.error("responseCode:", error.responseCode);
        throw error;
    }
};
