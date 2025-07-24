import prisma from "../prisma";

// Type definitions for better auto-completion
interface Category {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ArtisanUser {
    id: string;
    name: string | null;
    email: string;
    profileImageUrl: string | null;
    location?: string | null;
    ArtisanProfile?: ArtisanProfile | null;
}

interface ArtisanProfile {
    id: string;
    userId: string;
    story: string;
    expertise: string;
    location: string | null;
    imageUrl: string | null;
    works: string[];
    createdAt: Date;
    updatedAt: Date;
}

interface ApplicantUser {
    id: string;
    name: string | null;
    email: string;
    profileImageUrl: string | null;
    ApplicantProfile?: ApplicantProfile | null;
}

interface ApplicantProfile {
    id: string;
    userId: string;
    background: string;
    interests: string;
    portfolioUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface ApplicationWithApplicant {
    id: string;
    message: string;
    status: string;
    motivation: string | null;
    cvUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    ProgramId: string;
    applicantId: string;
    applicant: ApplicantUser;
    Program?: {
        id: string;
        title: string;
        description: string;
        duration: string;
        location: string | null;
    };
}

interface ProgramWithDetails {
    id: string;
    title: string;
    isOpen: boolean;
    description: string;
    duration: string;
    location: string | null;
    criteria: string;
    categoryId: string;
    artisanId: string;
    programImageUrl: string | null;
    videoUrl: string | null;
    videoThumbnailUrl: string | null;
    startDate: Date;
    endDate: Date;
    galleryUrls: string[];
    galleryThumbnails: string[];
    createdAt: Date;
    updatedAt: Date;
    category: Category;
    artisan: ArtisanUser;
    applications: ApplicationWithApplicant[];
}

interface ProgramWithStats extends ProgramWithDetails {
    totalApplications: number;
    pendingApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
}

interface ArtisanStats {
    totalPrograms: number;
    activePrograms: number;
    totalApplications: number;
    pendingApplications: number;
    approvedApplications: number;
    completionRate: number;
}

interface RecentApplication extends ApplicationWithApplicant {
    programTitle: string;
    programId: string;
}

interface IProgramsRepository {
    getPrograms(artisanId: string): Promise<ProgramWithDetails[]>;
    getProgramById(id: string): Promise<ProgramWithDetails | null>;
    createProgram(data: ICreateProgramData): Promise<ProgramWithDetails>;
    updateProgram(id: string, data: IUpdateProgramData): Promise<ProgramWithDetails>;
    deleteProgram(id: string): Promise<void>;
    getApplicationsByProgram(programId: string): Promise<ApplicationWithApplicant[]>;
    getProgramsByArtisan(artisanId: string): Promise<ProgramWithDetails[]>;
}

interface ICreateProgramData {
    artisanId: string;
    title: string;
    description: string;
    duration: string;
    location: string;
    criteria: string;
    categoryId: string;
    startDate: Date;
    endDate: Date;
    programImageUrl?: string;
    videoUrl?: string;
    videoThumbnailUrl?: string;
    isOpen?: boolean;
}

interface IUpdateProgramData {
    title?: string;
    description?: string;
    duration?: string;
    location?: string;
    criteria?: string;
    categoryId?: string;
    startDate?: Date;
    endDate?: Date;
    programImageUrl?: string;
    videoUrl?: string;
    videoThumbnailUrl?: string;
    isOpen?: boolean;
}


const programsRepository: IProgramsRepository = {
    async getPrograms(artisanId: string): Promise<ProgramWithDetails[]> {
        return await prisma.program.findMany({
            where: {
                artisanId: artisanId
            },
            include: {
                category: true,
                artisan: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true
                    }
                },
                applications: {
                    include: {
                        applicant: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profileImageUrl: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }) as unknown as ProgramWithDetails[];
    },

    async getProgramById(id: string): Promise<ProgramWithDetails | null> {
        return await prisma.program.findUnique({
            where: { id },
            include: {
                category: true,
                artisan: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true,
                        location: true,
                        ArtisanProfile: true
                    }
                },
                applications: {
                    include: {
                        applicant: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profileImageUrl: true,
                                ApplicantProfile: true
                            }
                        }
                    }
                }
            }
        }) as unknown as ProgramWithDetails | null;
    },

    async createProgram(data: ICreateProgramData): Promise<ProgramWithDetails> {
        return await prisma.program.create({
            data: {
                artisanId: data.artisanId,
                title: data.title,
                description: data.description,
                duration: data.duration,
                location: data.location,
                criteria: data.criteria,
                categoryId: data.categoryId,
                startDate: data.startDate,
                endDate: data.endDate,
                programImageUrl: data.programImageUrl,
                videoUrl: data.videoUrl,
                videoThumbnailUrl: data.videoThumbnailUrl,
                isOpen: data.isOpen ?? true,
            },
            include: {
                category: true,
                artisan: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true
                    }
                },
                applications: {
                    include: {
                        applicant: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profileImageUrl: true
                            }
                        }
                    }
                }
            }
        }) as unknown as ProgramWithDetails;
    },

    async updateProgram(id: string, data: IUpdateProgramData): Promise<ProgramWithDetails> {
        return await prisma.program.update({
            where: { id },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.description && { description: data.description }),
                ...(data.duration && { duration: data.duration }),
                ...(data.location && { location: data.location }),
                ...(data.criteria && { criteria: data.criteria }),
                ...(data.categoryId && { categoryId: data.categoryId }),
                ...(data.startDate && { startDate: data.startDate }),
                ...(data.endDate && { endDate: data.endDate }),
                ...(data.programImageUrl !== undefined && { programImageUrl: data.programImageUrl }),
                ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
                ...(data.videoThumbnailUrl !== undefined && { videoThumbnailUrl: data.videoThumbnailUrl }),
                ...(data.isOpen !== undefined && { isOpen: data.isOpen }),
            },
            include: {
                category: true,
                artisan: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true
                    }
                },
                applications: {
                    include: {
                        applicant: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profileImageUrl: true
                            }
                        }
                    }
                }
            }
        }) as unknown as ProgramWithDetails;
    },

    async deleteProgram(id: string) {
        await prisma.program.delete({
            where: { id }
        });
    },

    async getApplicationsByProgram(programId: string): Promise<ApplicationWithApplicant[]> {
        return await prisma.application.findMany({
            where: {
                ProgramId: programId
            },
            include: {
                applicant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true,
                        ApplicantProfile: true
                    }
                },
                Program: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        duration: true,
                        location: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }) as unknown as ApplicationWithApplicant[];
    },

    async getProgramsByArtisan(artisanId: string): Promise<ProgramWithDetails[]> {
        return await prisma.program.findMany({
            where: {
                artisanId: artisanId
            },
            include: {
                category: true,
                artisan: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true
                    }
                },
                applications: {
                    include: {
                        applicant: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profileImageUrl: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }) as unknown as ProgramWithDetails[];
    }

}

// Export repository
export { programsRepository };

// Export interfaces for use in other files
    export type {
        ApplicantProfile, ApplicantUser, ApplicationWithApplicant, ArtisanProfile, ArtisanStats, ArtisanUser, Category, ICreateProgramData,
        IProgramsRepository,
        IUpdateProgramData,
        ProgramWithDetails,
        ProgramWithStats, RecentApplication
    };

// Utility functions
export const artisanUtils = {
    // Get programs with statistics
    async getProgramsWithStats(artisanId: string): Promise<ProgramWithStats[]> {
        const programs = await programsRepository.getPrograms(artisanId);

        return programs.map(program => ({
            ...program,
            totalApplications: program.applications.length,
            pendingApplications: program.applications.filter((app) => app.status === 'PENDING').length,
            approvedApplications: program.applications.filter((app) => app.status === 'APPROVED').length,
            rejectedApplications: program.applications.filter((app) => app.status === 'REJECTED').length,
        }));
    },

    // Get artisan dashboard statistics
    async getArtisanStats(artisanId: string): Promise<ArtisanStats> {
        const programs = await programsRepository.getPrograms(artisanId);

        const totalPrograms = programs.length;
        const activePrograms = programs.filter(p => p.isOpen).length;
        const totalApplications = programs.reduce((acc, program) => acc + program.applications.length, 0);
        const pendingApplications = programs.reduce((acc, program) =>
            acc + program.applications.filter((app) => app.status === 'PENDING').length, 0
        );
        const approvedApplications = programs.reduce((acc, program) =>
            acc + program.applications.filter((app) => app.status === 'APPROVED').length, 0
        );

        return {
            totalPrograms,
            activePrograms,
            totalApplications,
            pendingApplications,
            approvedApplications,
            completionRate: totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0
        };
    },

    // Get recent applications for artisan
    async getRecentApplications(artisanId: string, limit: number = 5): Promise<RecentApplication[]> {
        const programs = await programsRepository.getPrograms(artisanId);
        const allApplications = programs.flatMap(program =>
            program.applications.map((app) => ({
                ...app,
                programTitle: program.title,
                programId: program.id
            }))
        );

        return allApplications
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit);
    }
};
