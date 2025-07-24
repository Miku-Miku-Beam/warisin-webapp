import { getCurrentUser } from '@/lib/auth';
import { artisanRepository } from '@/lib/repository/artisan.repository';
import { redirect } from 'next/navigation';
import ArtisanProfileForm from './components/ArtisanProfileForm';

export default async function ArtisanProfilePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Get current user from server-side
    const user = await getCurrentUser();
    
    // Redirect if not authenticated or not an artisan
    if (!user || user.role !== 'ARTISAN') {
        redirect('/login/artisan');
    }

    // Get artisan profile data
    let artisanProfile;
    try {
        artisanProfile = await artisanRepository.getArtisanProfile(user.id);
    } catch (error) {
        console.error('Error loading artisan profile:', error);
        artisanProfile = null;
    }

    // Get search params for edit mode
    const params = await searchParams;
    const isEditMode = params.edit === 'true';

    return (
        <div className="flex-1 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>
                
                <ArtisanProfileForm 
                    user={user}
                    artisanProfile={artisanProfile}
                    isEditMode={isEditMode}
                />
            </div>
        </div>
    );
}
