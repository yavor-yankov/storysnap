import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AccountSettingsForm } from "@/components/dashboard/AccountSettingsForm"

export const metadata = {
  title: "Settings — PixTales",
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id as string },
    select: { id: true, name: true, email: true, credits: true, createdAt: true },
  })

  if (!user) {
    return null
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      <div className="max-w-2xl">
        <AccountSettingsForm user={{ ...user, createdAt: user.createdAt.toISOString() }} />
      </div>
    </div>
  )
}
