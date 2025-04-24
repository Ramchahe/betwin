import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  html: string
}

// Create a transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "user@example.com",
    pass: process.env.SMTP_PASSWORD || "password",
  },
})

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"BetWin" <noreply@betwin.com>',
      to,
      subject,
      html,
    })

    console.log("Email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

export const sendWelcomeEmail = async (to: string, name: string) => {
  const subject = "Welcome to BetWin!"
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #6d28d9;">Welcome to BetWin!</h1>
      <p>Hello ${name},</p>
      <p>Thank you for joining BetWin! We're excited to have you as part of our community.</p>
      
      <p>We've added a bonus of ₹20 to your wallet as a welcome gift. You can use this bonus to play any of our exciting games.</p>
      
      <p>Here are some quick links to get you started:</p>
      <ul style="list-style-type: none; padding-left: 0;">
        <li style="margin-bottom: 10px;">
          <a href="https://betwin.com/games" style="background-color: #6d28d9; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">Explore Games</a>
        </li>
        <li style="margin-bottom: 10px;">
          <a href="https://betwin.com/wallet" style="background-color: #6d28d9; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">Check Your Wallet</a>
        </li>
      </ul>
      
      <p>If you have any questions or need assistance, feel free to contact our support team at support@betwin.com.</p>
      
      <p>Happy gaming!</p>
      
      <p>Best regards,<br>The BetWin Team</p>
    </div>
  `

  return sendEmail({ to, subject, html })
}

export const sendPasswordResetEmail = async (to: string, resetToken: string) => {
  const subject = "Reset Your BetWin Password"
  const resetLink = `https://betwin.com/reset-password?token=${resetToken}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #6d28d9;">Reset Your Password</h1>
      <p>You requested a password reset for your BetWin account.</p>
      <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
      
      <a href="${resetLink}" style="background-color: #6d28d9; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Reset Password</a>
      
      <p>If you didn't request this password reset, you can safely ignore this email.</p>
      
      <p>Best regards,<br>The BetWin Team</p>
    </div>
  `

  return sendEmail({ to, subject, html })
}

export const sendWinNotificationEmail = async (to: string, name: string, game: string, amount: number) => {
  const subject = `Congratulations! You won ₹${amount} on ${game}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #6d28d9;">Congratulations on Your Win!</h1>
      <p>Hello ${name},</p>
      <p>Great news! You've won <strong style="color: #16a34a;">₹${amount}</strong> playing ${game} on BetWin.</p>
      
      <p>Your winnings have been added to your wallet. Visit your wallet to view your updated balance or withdraw your funds.</p>
      
      <a href="https://betwin.com/wallet" style="background-color: #6d28d9; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Check Your Wallet</a>
      
      <p>Keep playing and winning!</p>
      
      <p>Best regards,<br>The BetWin Team</p>
    </div>
  `

  return sendEmail({ to, subject, html })
}
