import { Redis } from '@upstash/redis';
import 'dotenv/config';


// Automatically loads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from .env
const redis = Redis.fromEnv();


// Save OTP (Automatic deletion after 300 seconds)
export const saveOTP = async (email, otp) => {
    const key = `otp:${email}`;
    await redis.set(key, otp, { ex: 300 });
    console.log(`OTP: ${otp} has been saved for: ${email}`)
}

// Verify and delete
export const verifyOTP = async (email, userOTP) => {
    const key = `otp:${email}`;
    const savedOTP = await redis.get(key);
    if (!savedOTP) {
        return { success: false, message: "Expired or not found" };
    }
    if (savedOTP != userOTP) {
        return { success: false, message: "Invalid OTP" };
    }
    await redis.del(key);
    return { success: true, message: "Verified successfully" };
}

export const deleteOTP = async (email) => {
    const key = `otp:${email}`;
    await redis.del(key);
}