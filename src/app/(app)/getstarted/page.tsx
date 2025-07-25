import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import GetStartedForm from './components/GetStartedForm';

export default async function GetStartedPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login/applicant');
  }
  if (user.onboarded) {
    redirect('/dashboard/applicant');
  }
  return <GetStartedForm user={user} />;
}
