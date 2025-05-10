import { cookies } from 'next/headers'
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

// Called after login to set the session cookie
export async function createSession(userId) {
  const cookieStore = cookies()
  cookieStore.set('session', userId.toString(), {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
  })
}

// Called to get current user from cookie
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const session =  cookieStore.get('session')

  if (!session?.value) return null

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.value) },
  })

  return user
}

// Called to logout
export function destroySession() {
  const cookieStore = cookies()
  cookieStore.delete('session')
}
