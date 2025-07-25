import { getCurrentCookie } from "@/lib/auth";
import StatusChip from "@/lib/components/StatusChip";
import { repositories } from "@/lib/repository";
import Link from "next/link";

const getApplicantions = async () => {
    const cookie = await getCurrentCookie();
    if (!cookie) {
        throw new Error("User not authenticated");
    }

    const userId = cookie.userId;
    // Fetch applications for the artisanc

    const response = await repositories.application.getApplicationsByArtisan(userId);

    return response
};


const ArtisanApplicationsPage = async () => {
    try {
        const applications = await getApplicantions();
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Your Applications</h1>
                {applications.length > 0 ? (
                    <ul className="space-y-4">
                        {applications.map((app) => (
                            <li key={app.id} className="p-4 border rounded-lg shadow-sm flex items-center justify-between">
                                {/* Foto profile di kiri */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src={app.applicant.profileImageUrl || '/default-profile.png'}
                                        alt={app.applicant.name}
                                        className="w-14 h-14 rounded-full object-cover border"
                                    />
                                    <div>
                                        <h2 className="text-xl font-semibold">{app.applicant.name}</h2>
                                        <StatusChip status={app.status} />
                                        <p>Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div>
                                    <Link
                                        href={`/dashboard/artisan/applicants/${app.id}`}
                                        className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
                                    >
                                        View
                                    </Link>
                                    <a
                                        href="https://wa.me/6281234567890"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 bg-green-500 text-white px-4 py-2 rounded inline-block"
                                    >
                                        Hubungi
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No applications found.</p>
                )}
            </div>
        );
    } catch (error) {
        console.error("Error fetching applications:", error);
        return <p>Error loading applications. Please try again later.</p>;
    }
}

export default ArtisanApplicationsPage;