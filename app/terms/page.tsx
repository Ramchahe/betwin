import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

          <div className="prose max-w-none">
            <p>
              Welcome to BetWin. These Terms and Conditions govern your use of our website and services. By accessing or
              using our platform, you agree to be bound by these Terms.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-3">1. Eligibility</h2>
            <p>
              1.1. You must be at least 18 years old to use our services.
              <br />
              1.2. You must ensure that gambling is legal in your jurisdiction before using our platform.
              <br />
              1.3. We reserve the right to verify your age and identity at any time.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-3">2. Account Registration</h2>
            <p>
              2.1. You must provide accurate and complete information when creating an account.
              <br />
              2.2. You are responsible for maintaining the confidentiality of your account credentials.
              <br />
              2.3. You are solely responsible for all activities that occur under your account.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-3">3. Wallet and Transactions</h2>
            <p>
              3.1. All transactions on our platform are conducted in Indian Rupees (₹).
              <br />
              3.2. Minimum and maximum bet amounts are specified for each game.
              <br />
              3.3. We reserve the right to set limits on deposits, withdrawals, and bets.
              <br />
              3.4. Bonus credits are subject to specific terms and conditions.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-3">4. Games and Betting</h2>
            <p>
              4.1. Game rules are provided for each game on our platform.
              <br />
              4.2. We reserve the right to modify game rules at any time.
              <br />
              4.3. All games involve an element of chance and outcomes are determined by random number generators.
              <br />
              4.4. In case of technical issues during gameplay, we reserve the right to void bets and refund stakes.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-3">5. Responsible Gambling</h2>
            <p>
              5.1. We promote responsible gambling and provide tools to help you manage your gambling activity.
              <br />
              5.2. You can set deposit limits, betting limits, and self-exclusion periods.
              <br />
              5.3. If you believe you may have a gambling problem, we encourage you to seek help from professional
              organizations.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-3">6. Prohibited Activities</h2>
            <p>
              6.1. You must not use our platform for any illegal or unauthorized purpose.
              <br />
              6.2. You must not attempt to manipulate game outcomes or exploit bugs or errors.
              <br />
              6.3. You must not use automated systems or bots to interact with our platform.
              <br />
              6.4. You must not engage in any form of collusion or cheating.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-3">7. Intellectual Property</h2>
            <p>
              7.1. All content on our platform, including games, graphics, and software, is protected by intellectual
              property rights.
              <br />
              7.2. You may not reproduce, distribute, or create derivative works based on our content without our
              permission.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-3">8. Privacy</h2>
            <p>
              8.1. We collect and process your personal information in accordance with our Privacy Policy.
              <br />
              8.2. By using our platform, you consent to our collection and use of your personal information.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-3">9. Termination</h2>
            <p>
              9.1. We reserve the right to suspend or terminate your account at any time for any reason.
              <br />
              9.2. Upon termination, you will no longer have access to your account or any funds in your wallet.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-3">10. Limitation of Liability</h2>
            <p>
              10.1. We are not liable for any direct, indirect, incidental, or consequential damages arising from your
              use of our platform.
              <br />
              10.2. Our total liability to you shall not exceed the amount of your deposits in the 30 days preceding the
              claim.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-3">11. Changes to Terms</h2>
            <p>
              11.1. We reserve the right to modify these Terms at any time.
              <br />
              11.2. We will notify you of significant changes to these Terms.
              <br />
              11.3. Your continued use of our platform after changes to these Terms constitutes your acceptance of the
              new Terms.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-3">12. Governing Law</h2>
            <p>
              12.1. These Terms are governed by the laws of India.
              <br />
              12.2. Any disputes arising from these Terms shall be resolved through arbitration in accordance with the
              laws of India.
            </p>

            <p className="mt-8">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
