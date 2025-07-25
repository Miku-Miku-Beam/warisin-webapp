import { getCurrentUser } from '@/lib/auth'; // atau utility auth Anda
import GetStartedForm from './GetStartedForm';
import { redirect } from 'next/navigation';

export default async function GetStartedPage() {
  const user = await getCurrentUser(); // SSR: ambil dari cookie/session

  if (user.onboarded) {
    // Jika sudah onboarding, redirect ke dashboard
    redirect('/dashboard/applicant');
  }
  return <GetStartedForm user={user} />;
} 