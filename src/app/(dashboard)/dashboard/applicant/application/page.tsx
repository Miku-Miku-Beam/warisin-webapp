import { getCurrentCookie } from "@/lib/auth";
import { repositories } from "@/lib/repository";
import ApplicantList from "./applicantListCard";

const getApplications = async () => {
    const cookie = await getCurrentCookie();
    if (!cookie) {
        throw new Error("User not authenticated");
    }

    const userId = cookie.userId;
    // Fetch applications for the applicant (bukan artisan)
    const response = await repositories.application.getApplicationsByApplicant(userId);

    return response;
};

const ApplicantApplicationsPage = async () => {
    try {
        const applications = await getApplications();
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Your Applications</h1>
                {applications.length > 0 ? (
                    <ApplicantList notifications={applications} />
                ) : (
                    <p>No applications found.</p>
                )}
            </div>
        );
    } catch (error) {
        console.error("Error fetching applications:", error);
        return <p>Error loading applications. Please try again later.</p>;
    }
};

export default ApplicantApplicationsPage;