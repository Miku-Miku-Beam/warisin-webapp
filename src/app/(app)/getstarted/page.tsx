import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import GetStartedForm from './components/GetStartedForm';

export default async function GetStartedPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login/applicant');
  }
  // Onboarding dianggap selesai jika sudah punya ApplicantProfile
  if (user.ApplicantProfile) {
    redirect('/dashboard/applicant');
  }
  // Perbaiki agar name tidak null
  if (user.name == null) user.name = '';
  if (user.location == null) user.location = '';
  return <GetStartedForm user={user} />;
}
