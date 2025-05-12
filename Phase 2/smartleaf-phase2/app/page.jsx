import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const role = session.user.role;

  if (role === 'student') redirect('/student');
  if (role === 'instructor') redirect('/instructor');
  if (role === 'admin') redirect('/admin');

  return null;
}
