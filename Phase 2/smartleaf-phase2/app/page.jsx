
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function HomePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role === 'student') redirect('/student')
  if (user.role === 'instructor') redirect('/instructor')
  if (user.role === 'admin') redirect('/admin')

  return null
}
