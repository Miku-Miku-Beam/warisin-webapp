import prisma from "../prisma";

interface IProgramsRepository {
    getPrograms(artisanId: string): Promise<any[]>;
    getProgramById(id: string): Promise<any | null>;
    createProgram(data: ICreateProgramData): Promise<any>;
    updateProgram(id: string, data: IUpdateProgramData): Promise<any>;
    deleteProgram(id: string): Promise<void>;
    getApplicationsByProgram(programId: string): Promise<any[]>;
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
    async getPrograms(artisanId: string) {
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
        });
    },

    async getProgramById(id: string) {
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
        });
    },

    async createProgram(data: ICreateProgramData) {
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
                }
            }
        });
    },

    async updateProgram(id: string, data: IUpdateProgramData) {
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
                }
            }
        });
    },

    async deleteProgram(id: string) {
        await prisma.program.delete({
            where: { id }
        });
    },

    async getApplicationsByProgram(programId: string) {
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
        });
    }
}

// Export repository
export { programsRepository };

// Export interfaces for use in other files
    export type { ICreateProgramData, IProgramsRepository, IUpdateProgramData };

// Utility functions
export const artisanUtils = {
    // Get programs with statistics
    async getProgramsWithStats(artisanId: string) {
        const programs = await programsRepository.getPrograms(artisanId);
        
        return programs.map(program => ({
            ...program,
            totalApplications: program.applications.length,
            pendingApplications: program.applications.filter((app: any) => app.status === 'PENDING').length,
            approvedApplications: program.applications.filter((app: any) => app.status === 'APPROVED').length,
            rejectedApplications: program.applications.filter((app: any) => app.status === 'REJECTED').length,
        }));
    },

    // Get artisan dashboard statistics
    async getArtisanStats(artisanId: string) {
        const programs = await programsRepository.getPrograms(artisanId);
        
        const totalPrograms = programs.length;
        const activePrograms = programs.filter(p => p.isOpen).length;
        const totalApplications = programs.reduce((acc, program) => acc + program.applications.length, 0);
        const pendingApplications = programs.reduce((acc, program) => 
            acc + program.applications.filter((app: any) => app.status === 'PENDING').length, 0
        );
        const approvedApplications = programs.reduce((acc, program) => 
            acc + program.applications.filter((app: any) => app.status === 'APPROVED').length, 0
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
    async getRecentApplications(artisanId: string, limit: number = 5) {
        const programs = await programsRepository.getPrograms(artisanId);
        const allApplications = programs.flatMap(program => 
            program.applications.map((app: any) => ({
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
