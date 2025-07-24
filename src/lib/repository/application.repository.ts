import prisma from "../prisma";

interface ICreateApplicationData {
    ProgramId: string;
    applicantId: string;
    message: string;
    motivation?: string;
}

interface IUpdateApplicationData {
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    message?: string;
    motivation?: string;
}

// Type definitions for better auto-completion
interface ArtisanUser {
    id: string;
    name: string;
    profileImageUrl?: string | null;
    location?: string | null;
}

interface Category {
    id: string;
    name: string;
}

interface ApplicantProfile {
    id: string;
    interests?: string | null;
    background?: string | null;
}

interface ApplicantUser {
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string | null;
    location?: string | null;
    ApplicantProfile?: ApplicantProfile | null;
}

interface ProgramWithDetails {
    id: string;
    title: string;
    description?: string | null;
    duration?: number | null;
    maxParticipants?: number | null;
    price?: number | null;
    isOpen: boolean;
    createdAt: Date;
    updatedAt: Date;
    artisanId: string;
    categoryId: string;
    artisan: ArtisanUser;
    category: Category;
}

interface ApplicationWithDetails {
    id: string;
    message: string;
    motivation?: string | null;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    createdAt: Date;
    updatedAt: Date;
    ProgramId: string;
    applicantId: string;
    Program: ProgramWithDetails;
    applicant: ApplicantUser;
}

interface ApplicationStats {
    totalApplications: number;
    recentApplications: number;
    statusDistribution: Record<string, number>;
    topPrograms: Array<{
        id: string;
        title: string;
        artisan: {
            name: string | null;
        } | null;
        applicationCount: number;
    }>;
    averageApplicationsPerProgram: number;
}

interface ProgramApplicationStats {
    totalApplications: number;
    statusDistribution: Record<string, number>;
    applicationTrend: Array<{
        date: string;
        applications: number;
    }>;
}

interface ApplicantApplicationStats {
    totalApplications: number;
    statusDistribution: Record<string, number>;
    categoryDistribution: Record<string, number>;
}

interface ArtisanApplicationStats {
    totalApplications: number;
    statusDistribution: Record<string, number>;
    programPerformance: Array<{
        id: string;
        title: string;
        applicationCount: number;
    }>;
}

interface IApplicationRepository {
    // Application management
    getAllApplications(): Promise<ApplicationWithDetails[]>;
    getApplicationById(id: string): Promise<ApplicationWithDetails | null>;
    createApplication(data: ICreateApplicationData): Promise<ApplicationWithDetails>;
    updateApplication(id: string, data: IUpdateApplicationData): Promise<ApplicationWithDetails>;
    deleteApplication(id: string): Promise<void>;
    
    // Status management
    approveApplication(id: string): Promise<ApplicationWithDetails>;
    rejectApplication(id: string, reason?: string): Promise<ApplicationWithDetails>;
    completeApplication(id: string): Promise<ApplicationWithDetails>;
    
    // Query methods
    getApplicationsByProgram(programId: string): Promise<ApplicationWithDetails[]>;
    getApplicationsByApplicant(applicantId: string): Promise<ApplicationWithDetails[]>;
    getApplicationsByArtisan(artisanId: string): Promise<ApplicationWithDetails[]>;
    getApplicationsByStatus(status: string): Promise<ApplicationWithDetails[]>;
    
    // Statistics
    getApplicationStats(): Promise<ApplicationStats>;
    getApplicationStatsByProgram(programId: string): Promise<ProgramApplicationStats>;
    getApplicationStatsByApplicant(applicantId: string): Promise<ApplicantApplicationStats>;
    getApplicationStatsByArtisan(artisanId: string): Promise<ArtisanApplicationStats>;
}

const applicationRepository: IApplicationRepository = {
    // Application management
    async getAllApplications(): Promise<ApplicationWithDetails[]> {
        return await prisma.application.findMany({
            include: {
                Program: {
                    include: {
                        artisan: {
                            select: {
                                id: true,
                                name: true,
                                profileImageUrl: true,
                                location: true
                            }
                        },
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                applicant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true,
                        location: true,
                        ApplicantProfile: {
                            select: {
                                id: true,
                                interests: true,
                                background: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }) as unknown as ApplicationWithDetails[];
    },

    async getApplicationById(id: string): Promise<ApplicationWithDetails | null> {
        return await prisma.application.findUnique({
            where: { id },
            include: {
                Program: {
                    include: {
                        artisan: {
                            select: {
                                id: true,
                                name: true,
                                profileImageUrl: true,
                                location: true
                            }
                        },
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                applicant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true,
                        location: true,
                        ApplicantProfile: {
                            select: {
                                id: true,
                                interests: true,
                                background: true
                            }
                        }
                    }
                }
            }
        }) as unknown as ApplicationWithDetails | null;
    },

    async createApplication(data: ICreateApplicationData): Promise<ApplicationWithDetails> {
        // Check if program exists and is open
        const program = await prisma.program.findUnique({
            where: { id: data.ProgramId }
        });

        if (!program) {
            throw new Error('Program not found');
        }

        if (!program.isOpen) {
            throw new Error('Program is not accepting applications');
        }

        // Check if application already exists
        const existingApplication = await prisma.application.findFirst({
            where: {
                ProgramId: data.ProgramId,
                applicantId: data.applicantId
            }
        });

        if (existingApplication) {
            throw new Error('Application already exists for this program');
        }

        return await prisma.application.create({
            data: {
                ProgramId: data.ProgramId,
                applicantId: data.applicantId,
                message: data.message,
                motivation: data.motivation,
                status: 'PENDING'
            },
            include: {
                Program: {
                    include: {
                        artisan: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        category: true
                    }
                },
                applicant: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        }) as unknown as ApplicationWithDetails;
    },

    async updateApplication(id: string, data: IUpdateApplicationData): Promise<ApplicationWithDetails> {
        return await prisma.application.update({
            where: { id },
            data: {
                ...(data.status && { status: data.status }),
                ...(data.message && { message: data.message }),
                ...(data.motivation && { motivation: data.motivation })
            },
            include: {
                Program: {
                    include: {
                        artisan: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        category: true
                    }
                },
                applicant: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        }) as unknown as ApplicationWithDetails;
    },

    async deleteApplication(id: string) {
        await prisma.application.delete({
            where: { id }
        });
    },

    // Status management
    async approveApplication(id: string) {
        return await this.updateApplication(id, { status: 'APPROVED' });
    },

    async rejectApplication(id: string, reason?: string) {
        return await this.updateApplication(id, { 
            status: 'REJECTED'
        });
    },

    async completeApplication(id: string) {
        return await this.updateApplication(id, { status: 'COMPLETED' });
    },

    // Query methods
    async getApplicationsByProgram(programId: string): Promise<ApplicationWithDetails[]> {
        return await prisma.application.findMany({
            where: { ProgramId: programId },
            include: {
                Program: {
                    include: {
                        artisan: {
                            select: {
                                id: true,
                                name: true,
                                profileImageUrl: true,
                                location: true
                            }
                        },
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                applicant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true,
                        location: true,
                        ApplicantProfile: {
                            select: {
                                id: true,
                                interests: true,
                                background: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }) as unknown as ApplicationWithDetails[];
    },

    async getApplicationsByApplicant(applicantId: string): Promise<ApplicationWithDetails[]> {
        return await prisma.application.findMany({
            where: { applicantId },
            include: {
                Program: {
                    include: {
                        artisan: {
                            select: {
                                id: true,
                                name: true,
                                profileImageUrl: true,
                                location: true
                            }
                        },
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                applicant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true,
                        location: true,
                        ApplicantProfile: {
                            select: {
                                id: true,
                                interests: true,
                                background: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }) as unknown as ApplicationWithDetails[];
    },

    async getApplicationsByArtisan(artisanId: string): Promise<ApplicationWithDetails[]> {
        return await prisma.application.findMany({
            where: {
                Program: {
                    artisanId: artisanId
                }
            },
            include: {
                Program: {
                    include: {
                        artisan: {
                            select: {
                                id: true,
                                name: true,
                                profileImageUrl: true,
                                location: true
                            }
                        },
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                applicant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true,
                        location: true,
                        ApplicantProfile: {
                            select: {
                                id: true,
                                interests: true,
                                background: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }) as unknown as ApplicationWithDetails[];
    },

    async getApplicationsByStatus(status: string): Promise<ApplicationWithDetails[]> {
        return await prisma.application.findMany({
            where: { status },
            include: {
                Program: {
                    include: {
                        artisan: {
                            select: {
                                id: true,
                                name: true,
                                profileImageUrl: true,
                                location: true
                            }
                        },
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                applicant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true,
                        location: true,
                        ApplicantProfile: {
                            select: {
                                id: true,
                                interests: true,
                                background: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }) as unknown as ApplicationWithDetails[];
    },

    // Statistics
    async getApplicationStats(): Promise<ApplicationStats> {
        const totalApplications = await prisma.application.count();
        
        const statusStats = await prisma.application.groupBy({
            by: ['status'],
            _count: {
                status: true
            }
        });

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentApplications = await prisma.application.count({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo
                }
            }
        });

        const topPrograms = await prisma.application.groupBy({
            by: ['ProgramId'],
            _count: {
                ProgramId: true
            },
            orderBy: {
                _count: {
                    ProgramId: 'desc'
                }
            },
            take: 5
        });

        // Get program details for top programs
        const topProgramsWithDetails = await Promise.all(
            topPrograms.map(async (tp) => {
                const program = await prisma.program.findUnique({
                    where: { id: tp.ProgramId },
                    select: {
                        id: true,
                        title: true,
                        artisan: {
                            select: {
                                name: true
                            }
                        }
                    }
                });
                return {
                    id: program?.id || '',
                    title: program?.title || '',
                    artisan: program?.artisan || null,
                    applicationCount: tp._count.ProgramId
                };
            })
        );

        const totalPrograms = await prisma.program.count();

        return {
            totalApplications,
            recentApplications,
            statusDistribution: statusStats.reduce((acc, stat) => {
                acc[stat.status.toLowerCase()] = stat._count.status;
                return acc;
            }, {} as Record<string, number>),
            topPrograms: topProgramsWithDetails,
            averageApplicationsPerProgram: totalPrograms > 0 ? Math.round(totalApplications / totalPrograms) : 0
        };
    },

    async getApplicationStatsByProgram(programId: string): Promise<ProgramApplicationStats> {
        const totalApplications = await prisma.application.count({
            where: { ProgramId: programId }
        });

        const statusStats = await prisma.application.groupBy({
            by: ['status'],
            where: { ProgramId: programId },
            _count: {
                status: true
            }
        });

        const applicationTrend = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const dayApplications = await prisma.application.count({
                where: {
                    ProgramId: programId,
                    createdAt: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                }
            });

            applicationTrend.push({
                date: date.toISOString().split('T')[0],
                applications: dayApplications
            });
        }

        return {
            totalApplications,
            statusDistribution: statusStats.reduce((acc, stat) => {
                acc[stat.status.toLowerCase()] = stat._count.status;
                return acc;
            }, {} as Record<string, number>),
            applicationTrend
        };
    },

    async getApplicationStatsByApplicant(applicantId: string): Promise<ApplicantApplicationStats> {
        const totalApplications = await prisma.application.count({
            where: { applicantId }
        });

        const statusStats = await prisma.application.groupBy({
            by: ['status'],
            where: { applicantId },
            _count: {
                status: true
            }
        });

        const categoryStats = await prisma.application.findMany({
            where: { applicantId },
            include: {
                Program: {
                    include: {
                        category: true
                    }
                }
            }
        });

        const categoryDistribution = categoryStats.reduce((acc, app) => {
            const categoryName = app.Program.category.name;
            acc[categoryName] = (acc[categoryName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalApplications,
            statusDistribution: statusStats.reduce((acc, stat) => {
                acc[stat.status.toLowerCase()] = stat._count.status;
                return acc;
            }, {} as Record<string, number>),
            categoryDistribution
        };
    },

    async getApplicationStatsByArtisan(artisanId: string): Promise<ArtisanApplicationStats> {
        const totalApplications = await prisma.application.count({
            where: {
                Program: {
                    artisanId: artisanId
                }
            }
        });

        const statusStats = await prisma.application.groupBy({
            by: ['status'],
            where: {
                Program: {
                    artisanId: artisanId
                }
            },
            _count: {
                status: true
            }
        });

        const programStats = await prisma.application.groupBy({
            by: ['ProgramId'],
            where: {
                Program: {
                    artisanId: artisanId
                }
            },
            _count: {
                ProgramId: true
            },
            orderBy: {
                _count: {
                    ProgramId: 'desc'
                }
            }
        });

        const programsWithDetails = await Promise.all(
            programStats.map(async (ps) => {
                const program = await prisma.program.findUnique({
                    where: { id: ps.ProgramId },
                    select: {
                        id: true,
                        title: true
                    }
                });
                return {
                    id: program?.id || '',
                    title: program?.title || '',
                    applicationCount: ps._count.ProgramId
                };
            })
        );

        return {
            totalApplications,
            statusDistribution: statusStats.reduce((acc, stat) => {
                acc[stat.status.toLowerCase()] = stat._count.status;
                return acc;
            }, {} as Record<string, number>),
            programPerformance: programsWithDetails
        };
    }
};

// Export repository
export { applicationRepository };

// Export interfaces
    export type {
        ApplicantApplicationStats, ApplicantProfile,
        ApplicantUser, ApplicationStats, ApplicationWithDetails, ArtisanApplicationStats, ArtisanUser,
        Category, IApplicationRepository,
        ICreateApplicationData,
        IUpdateApplicationData, ProgramApplicationStats, ProgramWithDetails
    };

// Application utility functions
export const applicationUtils = {
    // Check if user can apply to program
    async canApplyToProgram(applicantId: string, programId: string): Promise<{ canApply: boolean; reason?: string }> {
        // Check if program exists and is open
        const program = await prisma.program.findUnique({
            where: { id: programId }
        });

        if (!program) {
            return { canApply: false, reason: 'Program not found' };
        }

        if (!program.isOpen) {
            return { canApply: false, reason: 'Program is not accepting applications' };
        }

        // Check if already applied
        const existingApplication = await prisma.application.findFirst({
            where: {
                ProgramId: programId,
                applicantId
            }
        });

        if (existingApplication) {
            return { canApply: false, reason: 'Already applied to this program' };
        }

        return { canApply: true };
    },

    // Get application response time (artisan response to applications)
    async getArtisanResponseTime(artisanId: string) {
        const applications = await prisma.application.findMany({
            where: {
                Program: {
                    artisanId: artisanId
                },
                status: {
                    in: ['APPROVED', 'REJECTED']
                }
            },
            select: {
                createdAt: true,
                updatedAt: true
            }
        });

        if (applications.length === 0) return null;

        const responseTimes = applications.map(app => {
            const responseTime = app.updatedAt.getTime() - app.createdAt.getTime();
            return responseTime / (1000 * 60 * 60 * 24); // Convert to days
        });

        const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;

        return {
            averageResponseTimeDays: Math.round(averageResponseTime * 10) / 10,
            totalProcessedApplications: applications.length
        };
    },

    // Get conversion funnel for applications
    async getApplicationFunnel(timeframe: 'week' | 'month' | 'year' = 'month') {
        let startDate = new Date();
        
        switch (timeframe) {
            case 'week':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
        }

        const applications = await prisma.application.findMany({
            where: {
                createdAt: {
                    gte: startDate
                }
            },
            select: {
                status: true
            }
        });

        const total = applications.length;
        const pending = applications.filter(app => app.status === 'PENDING').length;
        const approved = applications.filter(app => app.status === 'APPROVED').length;
        const completed = applications.filter(app => app.status === 'COMPLETED').length;

        return {
            total,
            pending: { count: pending, percentage: total > 0 ? Math.round((pending / total) * 100) : 0 },
            approved: { count: approved, percentage: total > 0 ? Math.round((approved / total) * 100) : 0 },
            completed: { count: completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 },
            conversionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    },

    // Validate application message
    validateMessage(message: string): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!message || message.trim().length === 0) {
            errors.push('Message is required');
        }

        if (message.length < 20) {
            errors.push('Message must be at least 20 characters long');
        }

        if (message.length > 500) {
            errors.push('Message cannot exceed 500 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Get application success rate by category
    async getSuccessRateByCategory() {
        const applications = await prisma.application.findMany({
            include: {
                Program: {
                    include: {
                        category: true
                    }
                }
            }
        });

        const categoryStats = applications.reduce((acc, app) => {
            const categoryName = app.Program.category.name;
            
            if (!acc[categoryName]) {
                acc[categoryName] = {
                    total: 0,
                    completed: 0,
                    approved: 0
                };
            }
            
            acc[categoryName].total++;
            if (app.status === 'COMPLETED') acc[categoryName].completed++;
            if (app.status === 'APPROVED') acc[categoryName].approved++;
            
            return acc;
        }, {} as Record<string, { total: number; completed: number; approved: number }>);

        return Object.entries(categoryStats).map(([category, stats]) => ({
            category,
            total: stats.total,
            completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
            approvalRate: stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0
        }));
    }
};
