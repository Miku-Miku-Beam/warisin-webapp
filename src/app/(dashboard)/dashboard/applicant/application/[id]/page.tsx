import StatusChip from "@/lib/components/StatusChip";
import { repositories } from "@/lib/repository";
import dynamic from "next/dynamic";
import Image from "next/image";
import ApplicationActionButtons from "../../../artisan/applicants/ApplicationActionButtons";


interface ApplicationDetailPageProps {
    params: Promise<{ id: string }>;
}

const ApplicationDetailPage = async ({ params }: ApplicationDetailPageProps) => {
    const { id } = await params;

    // Fetch application detail by id
    const application = await repositories.application.getApplicationById(id);

    if (!application) {
        return <div className="p-8 text-center">Application not found.</div>;
    }

    const { applicant, Program, status, message, motivation, createdAt } = application;

    // Gabungkan CV dan Portfolio menjadi satu field
    let cvPortfolioUrl: string | undefined = undefined;
    if (application.message && application.message.startsWith('http')) cvPortfolioUrl = application.message;
    else if (application.motivation && application.motivation.startsWith('http')) cvPortfolioUrl = application.motivation;
    else if (applicant.ApplicantProfile?.background && applicant.ApplicantProfile.background.startsWith('http')) cvPortfolioUrl = applicant.ApplicantProfile.background;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-md rounded-xl border border-yellow-100 shadow-md">
            <div className="flex items-center gap-6 mb-6">
                <Image
                    src={applicant.profileImageUrl || "/default-avatar.png"}
                    alt={applicant.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full border-2 border-yellow-200 object-cover bg-white"
                />
                <div className="flex-1 flex items-center justify-between">
                    <div>
                        <div className="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-lg">
                            {applicant.name}
                            <span className="inline-block ml-2 px-3 py-1 rounded bg-yellow-50 text-yellow-700 text-sm font-semibold">Applicant</span>
                        </div>
                        <p className="text-gray-600">{applicant.email}</p>
                        {applicant.location && <p className="text-gray-500">Location: {applicant.location}</p>}
                    </div>
                    <a
                        href={`/dashboard/artisan/applicants/profile/${applicant.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium underline ml-4"
                    >
                        View Profile
                    </a>
                </div>
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Program</h3>
                <div className="bg-gray-50 p-4 rounded-xl border">
                    <p className="font-bold text-blue-700 text-base">{Program.title}</p>
                    <p className="text-gray-600">Category: {Program.category?.name}</p>
                    <p className="text-gray-600">Artisan: {Program.artisan?.name}</p>
                </div>
            </div>
            <div className="mb-4">
                    <StatusChip status={status} />
            </div>
            <div className="mb-4">
                <h4 className="font-semibold mb-1">Application Message</h4>
                <p className="bg-gray-100 p-4 rounded-xl text-gray-700 whitespace-pre-line text-base">{message}</p>
            </div>
            {motivation && (
                <div className="mb-4">
                    <h4 className="font-semibold mb-1">Motivation</h4>
                    <p className="bg-gray-100 p-4 rounded-xl text-gray-700 whitespace-pre-line text-base">{motivation}</p>
                </div>
            )}
            {/* Link CV dan Portfolio */}
            <div className="mb-4">
                <h4 className="font-semibold mb-1">CV/Portofolio</h4>
                {cvPortfolioUrl ? (
                    <a
                        href={cvPortfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition w-fit text-base"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8m-8-4h8M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6" /></svg>
                        <span className="text-blue-700 font-semibold">Lihat CV/Portofolio</span>
                    </a>
                ) : (
                    <span className="text-gray-500 italic">Tidak ada CV/Portofolio</span>
                )}
            </div>
            <div className="text-sm text-gray-500 mt-6">Applied on: {new Date(createdAt).toLocaleDateString()}</div>

            <div className="flex gap-3 mt-6">
                <ApplicationActionButtons applicationId={application.id} status={status} />
            </div>
        </div>
    );
};

export default ApplicationDetailPage;