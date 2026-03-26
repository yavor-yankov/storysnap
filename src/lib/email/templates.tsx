import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Img,
} from "@react-email/components"

interface WelcomeEmailProps {
  userName: string
  userEmail: string
}

export function WelcomeEmail({ userName, userEmail }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to PixTales — Your first 3 books are free!</Preview>
      <Body style={{ backgroundColor: "#f5f3ff", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <Section style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 20px rgba(139,92,246,0.1)" }}>
            <Heading style={{ color: "#7c3aed", fontSize: "28px", textAlign: "center" }}>
              Welcome to PixTales! 📚
            </Heading>

            <Text style={{ fontSize: "16px", color: "#374151", lineHeight: "1.6" }}>
              Hi {userName || "there"},
            </Text>

            <Text style={{ fontSize: "16px", color: "#374151", lineHeight: "1.6" }}>
              You&apos;re all set! Your PixTales account has been created and you have <strong>3 free credits</strong> ready to use.
            </Text>

            <Section style={{ backgroundColor: "#f5f3ff", borderRadius: "12px", padding: "20px", margin: "20px 0" }}>
              <Text style={{ fontWeight: "bold", color: "#7c3aed", marginBottom: "8px" }}>
                🎉 What you can do now:
              </Text>
              <Text style={{ color: "#4b5563", lineHeight: "1.8" }}>
                ✓ Upload your portrait photo<br />
                ✓ Choose from 6 stunning art styles<br />
                ✓ Get your personalized AI story book<br />
                ✓ Download as a beautiful PDF
              </Text>
            </Section>

            <Button
              href={`${process.env.NEXT_PUBLIC_APP_URL}/create/upload`}
              style={{
                backgroundColor: "#7c3aed",
                color: "#ffffff",
                padding: "12px 32px",
                borderRadius: "8px",
                fontWeight: "bold",
                display: "block",
                textAlign: "center",
              }}
            >
              Create Your First Book →
            </Button>

            <Hr style={{ borderColor: "#e5e7eb", margin: "30px 0" }} />

            <Text style={{ fontSize: "14px", color: "#9ca3af" }}>
              You signed up with {userEmail}. If you didn&apos;t create this account, please ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

interface BookReadyEmailProps {
  userName: string
  bookTitle: string
  bookId: string
  artStyle: string
}

export function BookReadyEmail({ userName, bookTitle, bookId, artStyle }: BookReadyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your PixTales book is ready! — {bookTitle}</Preview>
      <Body style={{ backgroundColor: "#f5f3ff", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <Section style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 20px rgba(139,92,246,0.1)" }}>
            <Heading style={{ color: "#7c3aed", fontSize: "28px", textAlign: "center" }}>
              Your Book is Ready! 🎉
            </Heading>

            <Text style={{ fontSize: "16px", color: "#374151" }}>
              Hi {userName || "there"},
            </Text>

            <Text style={{ fontSize: "16px", color: "#374151", lineHeight: "1.6" }}>
              Great news! Your personalized story book <strong>&ldquo;{bookTitle}&rdquo;</strong> in <strong>{artStyle}</strong> style has been generated and is ready to read!
            </Text>

            <Button
              href={`${process.env.NEXT_PUBLIC_APP_URL}/book/${bookId}`}
              style={{
                backgroundColor: "#7c3aed",
                color: "#ffffff",
                padding: "12px 32px",
                borderRadius: "8px",
                fontWeight: "bold",
                display: "block",
                textAlign: "center",
              }}
            >
              Read Your Book →
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

interface ReceiptEmailProps {
  userName: string
  credits: number
  amount: number
  currency: string
}

export function ReceiptEmail({ userName, credits, amount, currency }: ReceiptEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>PixTales — Payment Confirmation</Preview>
      <Body style={{ backgroundColor: "#f5f3ff", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <Section style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "40px" }}>
            <Heading style={{ color: "#7c3aed", fontSize: "24px" }}>
              Payment Confirmed ✓
            </Heading>

            <Text style={{ fontSize: "16px", color: "#374151" }}>
              Hi {userName || "there"}, thank you for your purchase!
            </Text>

            <Section style={{ backgroundColor: "#f5f3ff", borderRadius: "12px", padding: "20px", margin: "20px 0" }}>
              <Text style={{ fontWeight: "bold", margin: "0 0 8px" }}>Order Summary</Text>
              <Text style={{ margin: "4px 0" }}>Credits: {credits}</Text>
              <Text style={{ margin: "4px 0" }}>
                Amount: {(amount / 100).toFixed(2)} {currency.toUpperCase()}
              </Text>
            </Section>

            <Button
              href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
              style={{
                backgroundColor: "#7c3aed",
                color: "#ffffff",
                padding: "12px 32px",
                borderRadius: "8px",
                fontWeight: "bold",
              }}
            >
              Go to Dashboard →
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
