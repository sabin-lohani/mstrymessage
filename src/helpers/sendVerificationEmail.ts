import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";
import { sendEmail } from "@/lib/nodemailer";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // const resendRes = await resend.emails.send({
    //   from: "onboarding@resend.dev",
    //   to: email,
    //   subject: "Mstry message | Verification code",
    //   react: VerificationEmail({ username, otp: verifyCode }),
    // });
    await sendEmail({
      email,
      subject: "Mstry message | Verification code",
      html: `
      <p>Dear ${username},</p>
      <p>Your OTP for email verification is: <strong>${verifyCode}</strong></p>
      <p>Please use this OTP to verify your email.</p>
      <p>Thank you.</p>
    `,
    });

    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
