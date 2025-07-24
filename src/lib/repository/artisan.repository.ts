import prisma from "../prisma";

// Return types for better type safety and auto-completion
interface ArtisanUser {
    id: string;
    name: string | null;
    email: string;
    profileImageUrl: string | null;
    location: string | null;
    bio: string | null;
    role: 'ARTISAN';
    createdAt: Date;
    updatedAt: Date;
    ArtisanProfile: ArtisanProfileDetails | null;
    ArtisanPrograms: ProgramWithDetails[];
}

interface ArtisanProfileDetails {
    id: string;
    userId: string;
    story: string;
    expertise: string;
    location: string | null;
    imageUrl: string | null;
    works: string[];
    createdAt: Date;
    updatedAt: Date;
    user?: {
        id: string;
        name: string | null;
        email: string;
        profileImageUrl: string | null;
        location: string | null;
        bio: string | null;
        createdAt: Date;
        ArtisanPrograms?: ProgramWithApplications[];
    };
}

interface ProgramWithDetails {
    id: string;
    title: string;
    description: string;
    duration: string;
    location: string;
    criteria: string;
    startDate: Date;
    endDate: Date;
    programImageUrl: string | null;
    videoUrl: string | null;
    videoThumbnailUrl: string | null;
    isOpen: boolean;
    createdAt: Date;
    updatedAt: Date;
    category: {
        id: string;
        name: string;
        description?: string | null;
        createdAt?: Date;
        updatedAt?: Date;
    };
    artisan: {
        id: string;
        name: string | null;
        email: string;
        profileImageUrl: string | null;
    };
    applications: ApplicationWithApplicant[];
}

interface ProgramWithApplications {
    id: string;
    title: string;
    description: string;
    duration: string;
    location: string;
    criteria: string;
    startDate: Date;
    endDate: Date;
    programImageUrl: string | null;
    videoUrl: string | null;
    videoThumbnailUrl: string | null;
    isOpen: boolean;
    createdAt: Date;
    updatedAt: Date;
    category: {
        id: string;
        name: string;
        description?: string | null;
        createdAt?: Date;
        updatedAt?: Date;
    };
    applications: {
        id: string;
        status: string;
    }[];
}

interface ApplicationWithApplicant {
    id: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    applicant: {
        id: string;
        name: string | null;
        email: string;
        profileImageUrl: string | null;
        location: string | null;
        ApplicantProfile: {
            background: string;
            interests: string[];
            portfolioUrl: string | null;
        } | null;
    };
    Program: {
        id: string;
        title: string;
        description: string;
        duration: string;
        location: string;
        category: {
            id: string;
            name: string;
        };
    };
}

interface ApplicationWithProgram {
    id: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    applicant: {
        id: string;
        name: string | null;
        email: string;
        profileImageUrl: string | null;
    };
    Program: {
        id: string;
        title: string;
        artisan: {
            id: string;
            name: string | null;
            email: string;
        };
    };
}

interface ArtisanDashboard {
    totalPrograms: number;
    activePrograms: number;
    upcomingPrograms: number;
    ongoingPrograms: number;
    completedPrograms: number;
    totalApplications: number;
    pendingApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    recentActivity: number;
    approvalRate: number;
    averageApplicationsPerProgram: number;
    mostPopularProgram: {
        id: string;
        title: string;
        applicationCount: number;
    } | null;
    needsAttention: number;
}

interface ProgramPerformanceMetric {
    id: string;
    title: string;
    totalApplications: number;
    approvalRate: number;
    avgResponseTime: number;
    isPopular: boolean;
    status: string;
}

interface ArtisanPerformance extends ArtisanDashboard {
    programPerformance: ProgramPerformanceMetric[];
    performanceScore: number;
    recommendations: string[];
}

interface ICreateArtisanProfileData {
    userId: string;
    story: string;
    expertise: string;
    location?: string;
    imageUrl?: string;
    works?: string[];
}

interface IUpdateArtisanProfileData {
    story?: string;
    expertise?: string;
    location?: string;
    imageUrl?: string;
    works?: string[];
}

interface IArtisanProgramData {
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

interface IArtisanRepository {
    // Artisan profile management
    getArtisanById(userId: string): Promise<ArtisanUser | null>;
    getArtisanProfile(userId: string): Promise<ArtisanProfileDetails | null>;
    createArtisanProfile(data: ICreateArtisanProfileData): Promise<ArtisanProfileDetails>;
    updateArtisanProfile(userId: string, data: IUpdateArtisanProfileData): Promise<ArtisanProfileDetails>;
    deleteArtisanProfile(userId: string): Promise<void>;
    
    // Artisan's programs
    getMyPrograms(artisanId: string): Promise<ProgramWithDetails[]>;
    createProgram(artisanId: string, data: IArtisanProgramData): Promise<ProgramWithDetails>;
    updateMyProgram(artisanId: string, programId: string, data: IUpdateProgramData): Promise<ProgramWithDetails>;
    deleteMyProgram(artisanId: string, programId: string): Promise<void>;
    toggleProgramStatus(artisanId: string, programId: string): Promise<ProgramWithApplications>;
    
    // Artisan's applications management
    getMyApplications(artisanId: string): Promise<ApplicationWithApplicant[]>;
    reviewApplication(artisanId: string, applicationId: string, status: 'APPROVED' | 'REJECTED'): Promise<ApplicationWithProgram>;
    getApplicationsForProgram(artisanId: string, programId: string): Promise<ApplicationWithApplicant[]>;
    
    // Artisan dashboard and analytics
    getArtisanDashboard(artisanId: string): Promise<ArtisanDashboard>;
    getArtisanPerformance(artisanId: string): Promise<ArtisanPerformance>;
    
    // Helper methods
    calculateAvgResponseTime(applications: any[]): number;
    calculatePerformanceScore(dashboard: ArtisanDashboard): number;
    generateRecommendations(dashboard: ArtisanDashboard, programPerformance: ProgramPerformanceMetric[]): string[];
}

const artisanRepository: IArtisanRepository = {
    // Artisan profile management
    async getArtisanById(userId: string) {
        const result = await prisma.user.findUnique({
            where: { 
                id: userId,
                role: 'ARTISAN'
            },
            include: {
                ArtisanProfile: true,
                ArtisanPrograms: {
                    include: {
                        category: true,
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
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
        return result as ArtisanUser | null;
    },

    async getArtisanProfile(userId: string) {
        const result = await prisma.artisanProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true,
                        location: true,
                        bio: true,
                        createdAt: true,
                        ArtisanPrograms: {
                            include: {
                                category: true,
                                applications: {
                                    select: {
                                        id: true,
                                        status: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return result as ArtisanProfileDetails | null;
    },

    async createArtisanProfile(data: ICreateArtisanProfileData) {
        const result = await prisma.artisanProfile.create({
            data: {
                userId: data.userId,
                story: data.story,
                expertise: data.expertise,
                location: data.location,
                imageUrl: data.imageUrl,
                works: data.works || [],
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true,
                        location: true,
                        bio: true,
                        createdAt: true
                    }
                }
            }
        });
        return result as ArtisanProfileDetails;
    },

    async updateArtisanProfile(userId: string, data: IUpdateArtisanProfileData) {
        const result = await prisma.artisanProfile.update({
            where: { userId },
            data: {
                ...(data.story && { story: data.story }),
                ...(data.expertise && { expertise: data.expertise }),
                ...(data.location !== undefined && { location: data.location }),
                ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
                ...(data.works !== undefined && { works: data.works }),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true,
                        location: true,
                        bio: true,
                        createdAt: true
                    }
                }
            }
        });
        return result as ArtisanProfileDetails;
    },

    async deleteArtisanProfile(userId: string) {
        await prisma.artisanProfile.delete({
            where: { userId }
        });
    },

    // Artisan's programs
    async getMyPrograms(artisanId: string) {
        const result = await prisma.program.findMany({
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
                                profileImageUrl: true,
                                ApplicantProfile: {
                                    select: {
                                        background: true,
                                        interests: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return result as unknown as ProgramWithDetails[];
    },

    async createProgram(artisanId: string, data: IArtisanProgramData) {
        // Verify the user is an artisan
        const artisan = await prisma.user.findUnique({
            where: { 
                id: artisanId,
                role: 'ARTISAN'
            }
        });

        if (!artisan) {
            throw new Error('User is not an artisan or does not exist');
        }

        return await prisma.program.create({
            data: {
                artisanId: artisanId,
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
        }) as unknown as ProgramWithDetails;
    },

    async updateMyProgram(artisanId: string, programId: string, data: IUpdateProgramData) {
        // Verify the program belongs to this artisan
        const program = await prisma.program.findFirst({
            where: {
                id: programId,
                artisanId: artisanId
            }
        });

        if (!program) {
            throw new Error('Program not found or you do not have permission to update it');
        }

        return await prisma.program.update({
            where: { id: programId },
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
        }) as unknown as ProgramWithDetails;
    },

    async deleteMyProgram(artisanId: string, programId: string) {
        // Verify the program belongs to this artisan
        const program = await prisma.program.findFirst({
            where: {
                id: programId,
                artisanId: artisanId
            }
        });

        if (!program) {
            throw new Error('Program not found or you do not have permission to delete it');
        }

        await prisma.program.delete({
            where: { id: programId }
        });
    },

    async toggleProgramStatus(artisanId: string, programId: string) {
        // Verify the program belongs to this artisan
        const program = await prisma.program.findFirst({
            where: {
                id: programId,
                artisanId: artisanId
            }
        });

        if (!program) {
            throw new Error('Program not found or you do not have permission to modify it');
        }

        return await prisma.program.update({
            where: { id: programId },
            data: {
                isOpen: !program.isOpen
            },
            include: {
                category: true,
                applications: {
                    select: {
                        id: true,
                        status: true
                    }
                }
            }
        }) as unknown as ProgramWithApplications;
    },

    // Artisan's applications management
    async getMyApplications(artisanId: string) {
        return await prisma.application.findMany({
            where: {
                Program: {
                    artisanId: artisanId
                }
            },
            include: {
                applicant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true,
                        location: true,
                        ApplicantProfile: {
                            select: {
                                background: true,
                                interests: true,
                                portfolioUrl: true
                            }
                        }
                    }
                },
                Program: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        duration: true,
                        location: true,
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }) as unknown as ApplicationWithApplicant[];
    },

    async reviewApplication(artisanId: string, applicationId: string, status: 'APPROVED' | 'REJECTED') {
        // Verify the application belongs to this artisan's program
        const application = await prisma.application.findFirst({
            where: {
                id: applicationId,
                Program: {
                    artisanId: artisanId
                }
            }
        });

        if (!application) {
            throw new Error('Application not found or you do not have permission to review it');
        }

        return await prisma.application.update({
            where: { id: applicationId },
            data: { status },
            include: {
                applicant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true
                    }
                },
                Program: {
                    select: {
                        id: true,
                        title: true,
                        artisan: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        }) as unknown as ApplicationWithProgram;
    },

    async getApplicationsForProgram(artisanId: string, programId: string) {
        // Verify the program belongs to this artisan
        const program = await prisma.program.findFirst({
            where: {
                id: programId,
                artisanId: artisanId
            }
        });

        if (!program) {
            throw new Error('Program not found or you do not have permission to view its applications');
        }

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
                        location: true,
                        ApplicantProfile: {
                            select: {
                                background: true,
                                interests: true,
                                portfolioUrl: true
                            }
                        }
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

    // Artisan dashboard and analytics
    async getArtisanDashboard(artisanId: string) {
        const programs = await this.getMyPrograms(artisanId);
        const applications = await this.getMyApplications(artisanId);

        const totalPrograms = programs.length;
        const activePrograms = programs.filter(p => p.isOpen).length;
        const upcomingPrograms = programs.filter(p => new Date(p.startDate) > new Date()).length;
        const ongoingPrograms = programs.filter(p => 
            new Date(p.startDate) <= new Date() && new Date(p.endDate) >= new Date()
        ).length;
        const completedPrograms = programs.filter(p => new Date(p.endDate) < new Date()).length;

        const totalApplications = applications.length;
        const pendingApplications = applications.filter((app: any) => app.status === 'PENDING').length;
        const approvedApplications = applications.filter((app: any) => app.status === 'APPROVED').length;
        const rejectedApplications = applications.filter((app: any) => app.status === 'REJECTED').length;

        // Recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentApplications = applications.filter((app: any) => 
            new Date(app.createdAt) >= thirtyDaysAgo
        ).length;

        // Most popular program
        const programPopularity = programs.map(p => ({
            id: p.id,
            title: p.title,
            applicationCount: p.applications.length
        })).sort((a, b) => b.applicationCount - a.applicationCount);

        return {
            totalPrograms,
            activePrograms,
            upcomingPrograms,
            ongoingPrograms,
            completedPrograms,
            totalApplications,
            pendingApplications,
            approvedApplications,
            rejectedApplications,
            recentActivity: recentApplications,
            approvalRate: totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0,
            averageApplicationsPerProgram: totalPrograms > 0 ? Math.round(totalApplications / totalPrograms) : 0,
            mostPopularProgram: programPopularity[0] || null,
            needsAttention: pendingApplications
        };
    },

    async getArtisanPerformance(artisanId: string) {
        const dashboard = await this.getArtisanDashboard(artisanId);
        const programs = await this.getMyPrograms(artisanId);
        
        // Calculate performance metrics
        const programsWithMetrics = programs.map(program => {
            const totalApps = program.applications.length;
            const approvedApps = program.applications.filter((app: any) => app.status === 'APPROVED').length;
            const avgResponseTime = this.calculateAvgResponseTime(program.applications);

            return {
                id: program.id,
                title: program.title,
                totalApplications: totalApps,
                approvalRate: totalApps > 0 ? Math.round((approvedApps / totalApps) * 100) : 0,
                avgResponseTime: avgResponseTime,
                isPopular: totalApps > dashboard.averageApplicationsPerProgram,
                status: program.isOpen ? 'active' : 'inactive'
            };
        });

        // Overall performance score (0-100)
        const performanceScore = this.calculatePerformanceScore(dashboard);

        return {
            ...dashboard,
            programPerformance: programsWithMetrics,
            performanceScore,
            recommendations: this.generateRecommendations(dashboard, programsWithMetrics)
        };
    },

    // Helper methods
    calculateAvgResponseTime(applications: any[]): number {
        const processedApps = applications.filter(app => 
            app.status === 'APPROVED' || app.status === 'REJECTED'
        );

        if (processedApps.length === 0) return 0;

        const totalTime = processedApps.reduce((sum, app) => {
            const responseTime = new Date(app.updatedAt).getTime() - new Date(app.createdAt).getTime();
            return sum + responseTime;
        }, 0);

        return Math.round(totalTime / processedApps.length / (1000 * 60 * 60 * 24)); // Convert to days
    },

    calculatePerformanceScore(dashboard: any): number {
        let score = 0;

        // Active programs weight (30%)
        if (dashboard.activePrograms > 0) score += 30;

        // Approval rate weight (40%)
        score += (dashboard.approvalRate / 100) * 40;

        // Response time weight (20%) - higher score for faster response
        if (dashboard.pendingApplications < 5) score += 20;
        else if (dashboard.pendingApplications < 10) score += 10;

        // Activity level weight (10%)
        if (dashboard.recentActivity > 5) score += 10;
        else if (dashboard.recentActivity > 0) score += 5;

        return Math.round(score);
    },

    generateRecommendations(dashboard: any, programPerformance: any[]): string[] {
        const recommendations: string[] = [];

        if (dashboard.pendingApplications > 10) {
            recommendations.push('You have many pending applications. Consider reviewing them promptly.');
        }

        if (dashboard.approvalRate < 30) {
            recommendations.push('Your approval rate is low. Consider reviewing your program criteria.');
        }

        if (dashboard.activePrograms === 0) {
            recommendations.push('Create new programs to attract more applicants.');
        }

        const inactivePrograms = programPerformance.filter(p => p.status === 'inactive').length;
        if (inactivePrograms > dashboard.activePrograms) {
            recommendations.push('Consider reactivating some of your inactive programs.');
        }

        if (dashboard.recentActivity === 0) {
            recommendations.push('Promote your programs to increase visibility and applications.');
        }

        return recommendations;
    }
};

export { artisanRepository };
export default artisanRepository;

// Export interfaces
export type {
    ApplicationWithApplicant,
    ApplicationWithProgram,
    ArtisanDashboard,
    ArtisanPerformance, ArtisanProfileDetails,
    // Type definitions for return values (for better auto-completion)
    ArtisanUser, IArtisanProgramData,
    IArtisanRepository,
    ICreateArtisanProfileData,
    IUpdateArtisanProfileData,
    IUpdateProgramData, ProgramPerformanceMetric, ProgramWithApplications, ProgramWithDetails
};

// Utility functions for artisans
export const artisanUtils = {
    // Get programs with extended statistics
    async getProgramsWithStats(artisanId: string) {
        const programs = await artisanRepository.getMyPrograms(artisanId);
        
        return programs.map((program: any) => ({
            ...program,
            totalApplications: program.applications.length,
            pendingApplications: program.applications.filter((app: any) => app.status === 'PENDING').length,
            approvedApplications: program.applications.filter((app: any) => app.status === 'APPROVED').length,
            rejectedApplications: program.applications.filter((app: any) => app.status === 'REJECTED').length,
            isUpcoming: new Date(program.startDate) > new Date(),
            isOngoing: new Date(program.startDate) <= new Date() && new Date(program.endDate) >= new Date(),
            isCompleted: new Date(program.endDate) < new Date(),
        }));
    },

    // Get recent applications for artisan with additional context
    async getRecentApplications(artisanId: string, limit: number = 5) {
        const applications = await artisanRepository.getMyApplications(artisanId);
        
        return applications.slice(0, limit).map((app: any) => ({
            ...app,
            isNew: new Date(app.createdAt).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000), // Last 7 days
            timeAgo: getTimeAgo(app.createdAt)
        }));
    },

    // Get artisan performance metrics
    async getPerformanceMetrics(artisanId: string) {
        const dashboard = await artisanRepository.getArtisanDashboard(artisanId);
        const programs = await artisanRepository.getMyPrograms(artisanId);
        
        // Calculate average applications per program
        const avgApplicationsPerProgram = dashboard.totalPrograms > 0 
            ? Math.round(dashboard.totalApplications / dashboard.totalPrograms) 
            : 0;

        // Find most popular program
        const mostPopularProgram = programs.reduce((max: any, program: any) => 
            (program.applications?.length || 0) > (max?.applications?.length || 0) ? program : max, 
            programs[0] || null
        );

        // Calculate program popularity score
        const popularityScore = programs.length > 0 
            ? Math.round((dashboard.totalApplications / programs.length) * 10) 
            : 0;

        return {
            ...dashboard,
            avgApplicationsPerProgram,
            mostPopularProgram: mostPopularProgram ? {
                title: mostPopularProgram.title,
                applications: mostPopularProgram.applications?.length || 0
            } : null,
            popularityScore
        };
    },

    // Validate program dates
    validateProgramDates(startDate: Date, endDate: Date) {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        const errors: string[] = [];

        if (start <= now) {
            errors.push('Start date must be in the future');
        }

        if (end <= start) {
            errors.push('End date must be after start date');
        }

        const duration = end.getTime() - start.getTime();
        const daysDuration = duration / (1000 * 60 * 60 * 24);

        if (daysDuration < 7) {
            errors.push('Program duration must be at least 7 days');
        }

        if (daysDuration > 365) {
            errors.push('Program duration cannot exceed 365 days');
        }

        return {
            isValid: errors.length === 0,
            errors,
            duration: Math.ceil(daysDuration)
        };
    }
};

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
        return `${minutes} menit yang lalu`;
    } else if (hours < 24) {
        return `${hours} jam yang lalu`;
    } else {
        return `${days} hari yang lalu`;
    }
}
