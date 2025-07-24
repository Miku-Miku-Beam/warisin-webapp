import prisma from "../prisma";

interface ICreateApplicantProfileData {
    userId: string;
    background: string;
    interests: string;
    portfolioUrl?: string;
}

interface IUpdateApplicantProfileData {
    background?: string;
    interests?: string;
    portfolioUrl?: string;
}

interface IApplicantApplicationData {
    programId: string;
    message: string;
    motivation?: string;
    cvUrl?: string;
}

interface IApplicantRepository {
    // Applicant profile management
    getApplicantById(userId: string): Promise<any | null>;
    getApplicantProfile(userId: string): Promise<any | null>;
    createApplicantProfile(data: ICreateApplicantProfileData): Promise<any>;
    updateApplicantProfile(userId: string, data: IUpdateApplicantProfileData): Promise<any>;
    deleteApplicantProfile(userId: string): Promise<void>;
    
    // Applicant's applications
    getMyApplications(applicantId: string): Promise<any[]>;
    applyToProgram(applicantId: string, data: IApplicantApplicationData): Promise<any>;
    withdrawApplication(applicantId: string, applicationId: string): Promise<void>;
    
    // Program discovery
    browsePrograms(filters?: any, limit?: number): Promise<any[]>;
    searchPrograms(query: string, limit?: number): Promise<any[]>;
    getRecommendedPrograms(applicantId: string, limit?: number): Promise<any[]>;
    
    // Applicant statistics
    getApplicantDashboard(applicantId: string): Promise<any>;
}

const applicantRepository: IApplicantRepository = {
    // Applicant profile management
    async getApplicantById(userId: string) {
        return await prisma.user.findUnique({
            where: { 
                id: userId,
                role: 'APPLICANT'
            },
            include: {
                ApplicantProfile: true,
                Application: {
                    include: {
                        Program: {
                            include: {
                                category: true,
                                artisan: {
                                    select: {
                                        id: true,
                                        name: true,
                                        profileImageUrl: true,
                                        location: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
    },

    async getApplicantProfile(userId: string) {
        return await prisma.applicantProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true,
                        location: true,
                        createdAt: true
                    }
                }
            }
        });
    },

    async createApplicantProfile(data: ICreateApplicantProfileData) {
        return await prisma.applicantProfile.create({
            data: {
                userId: data.userId,
                background: data.background,
                interests: data.interests,
                portfolioUrl: data.portfolioUrl
            },
            include: {
                user: {
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

    async updateApplicantProfile(userId: string, data: IUpdateApplicantProfileData) {
        return await prisma.applicantProfile.update({
            where: { userId },
            data: {
                ...(data.background && { background: data.background }),
                ...(data.interests && { interests: data.interests }),
                ...(data.portfolioUrl !== undefined && { portfolioUrl: data.portfolioUrl })
            },
            include: {
                user: {
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

    async deleteApplicantProfile(userId: string) {
        await prisma.applicantProfile.delete({
            where: { userId }
        });
    },

    // Applicant's applications
    async getMyApplications(applicantId: string) {
        return await prisma.application.findMany({
            where: {
                applicantId: applicantId
            },
            include: {
                Program: {
                    include: {
                        category: true,
                        artisan: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profileImageUrl: true,
                                location: true,
                                ArtisanProfile: {
                                    select: {
                                        expertise: true,
                                        story: true
                                    }
                                }
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

    async applyToProgram(applicantId: string, data: IApplicantApplicationData) {
        // Check if program exists and is open
        const program = await prisma.program.findUnique({
            where: { id: data.programId }
        });

        if (!program) {
            throw new Error('Program not found');
        }

        if (!program.isOpen) {
            throw new Error('Program is not accepting applications');
        }

        // Check if already applied
        const existingApplication = await prisma.application.findFirst({
            where: {
                applicantId: applicantId,
                ProgramId: data.programId
            }
        });

        if (existingApplication) {
            throw new Error('You have already applied to this program');
        }

        return await prisma.application.create({
            data: {
                applicantId: applicantId,
                ProgramId: data.programId,
                message: data.message,
                motivation: data.motivation,
                cvUrl: data.cvUrl,
                status: 'PENDING'
            },
            include: {
                Program: {
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
                }
            }
        });
    },

    async withdrawApplication(applicantId: string, applicationId: string) {
        // Verify the application belongs to this applicant
        const application = await prisma.application.findFirst({
            where: {
                id: applicationId,
                applicantId: applicantId,
                status: 'PENDING' // Only allow withdrawal of pending applications
            }
        });

        if (!application) {
            throw new Error('Application not found or cannot be withdrawn');
        }

        await prisma.application.delete({
            where: { id: applicationId }
        });
    },

    // Program discovery
    async browsePrograms(filters?: any, limit?: number) {
        const whereClause: any = {
            isOpen: true,
            endDate: {
                gte: new Date() // Only show programs that haven't ended
            }
        };

        // Apply filters
        if (filters?.categoryId) {
            whereClause.categoryId = filters.categoryId;
        }

        if (filters?.location) {
            whereClause.location = {
                contains: filters.location,
                mode: 'insensitive'
            };
        }

        if (filters?.artisanId) {
            whereClause.artisanId = filters.artisanId;
        }

        const query = {
            where: whereClause,
            include: {
                category: true,
                artisan: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true,
                        location: true,
                        ArtisanProfile: {
                            select: {
                                expertise: true,
                                story: true
                            }
                        }
                    }
                },
                applications: {
                    select: {
                        id: true,
                        status: true
                    }
                }
            },
            orderBy: {
                startDate: 'asc' as const
            }
        };

        if (limit) {
            return await prisma.program.findMany({
                ...query,
                take: limit
            });
        }

        return await prisma.program.findMany(query);
    },

    async searchPrograms(query: string, limit?: number) {
        const searchQuery = {
            where: {
                isOpen: true,
                endDate: {
                    gte: new Date()
                },
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive' as const
                        }
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive' as const
                        }
                    },
                    {
                        category: {
                            name: {
                                contains: query,
                                mode: 'insensitive' as const
                            }
                        }
                    },
                    {
                        artisan: {
                            name: {
                                contains: query,
                                mode: 'insensitive' as const
                            }
                        }
                    }
                ]
            },
            include: {
                category: true,
                artisan: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true,
                        location: true,
                        ArtisanProfile: {
                            select: {
                                expertise: true,
                                story: true
                            }
                        }
                    }
                },
                applications: {
                    select: {
                        id: true,
                        status: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc' as const
            }
        };

        if (limit) {
            return await prisma.program.findMany({
                ...searchQuery,
                take: limit
            });
        }

        return await prisma.program.findMany(searchQuery);
    },

    async getRecommendedPrograms(applicantId: string, limit: number = 5) {
        // Get applicant profile
        const applicant = await prisma.user.findUnique({
            where: { id: applicantId },
            include: {
                ApplicantProfile: true,
                Application: {
                    select: {
                        ProgramId: true
                    }
                }
            }
        });

        if (!applicant) return [];

        // Get programs the user hasn't applied to
        const appliedProgramIds = applicant.Application.map(app => app.ProgramId);
        
        return await prisma.program.findMany({
            where: {
                isOpen: true,
                endDate: {
                    gte: new Date()
                },
                id: {
                    notIn: appliedProgramIds
                }
            },
            include: {
                category: true,
                artisan: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImageUrl: true,
                        location: true,
                        ArtisanProfile: {
                            select: {
                                expertise: true,
                                story: true
                            }
                        }
                    }
                },
                applications: {
                    select: {
                        id: true,
                        status: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        });
    },

    // Applicant statistics
    async getApplicantDashboard(applicantId: string) {
        const applications = await this.getMyApplications(applicantId);
        
        const totalApplications = applications.length;
        const pendingApplications = applications.filter((app: any) => app.status === 'PENDING').length;
        const approvedApplications = applications.filter((app: any) => app.status === 'APPROVED').length;
        const rejectedApplications = applications.filter((app: any) => app.status === 'REJECTED').length;
        const completedApplications = applications.filter((app: any) => app.status === 'COMPLETED').length;

        // Get categories applied to
        const categoriesApplied = new Set(applications.map((app: any) => app.Program.category.name));
        
        // Get recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentApplications = applications.filter((app: any) => 
            new Date(app.createdAt) >= thirtyDaysAgo
        ).length;

        return {
            totalApplications,
            pendingApplications,
            approvedApplications,
            rejectedApplications,
            completedApplications,
            successRate: totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0,
            completionRate: totalApplications > 0 ? Math.round((completedApplications / totalApplications) * 100) : 0,
            categoriesApplied: Array.from(categoriesApplied),
            recentActivity: recentApplications,
            upcomingPrograms: applications.filter((app: any) => 
                app.status === 'APPROVED' && new Date(app.Program.startDate) > new Date()
            ).length
        };
    }
};

// Export repository
export { applicantRepository };

// Export interfaces
    export type { IApplicantApplicationData, IApplicantRepository, ICreateApplicantProfileData, IUpdateApplicantProfileData };

// Utility functions for applicants
export const applicantUtils = {
    // Get applicant dashboard statistics
    async getApplicantStats(applicantId: string) {
        const applications = await applicantRepository.getMyApplications(applicantId);
        
        const totalApplications = applications.length;
        const pendingApplications = applications.filter((app: any) => app.status === 'PENDING').length;
        const approvedApplications = applications.filter((app: any) => app.status === 'APPROVED').length;
        const rejectedApplications = applications.filter((app: any) => app.status === 'REJECTED').length;

        return {
            totalApplications,
            pendingApplications,
            approvedApplications,
            rejectedApplications,
            successRate: totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0
        };
    },

    // Check if applicant already applied to a program
    async hasAppliedToProgram(applicantId: string, programId: string) {
        const existingApplication = await prisma.application.findFirst({
            where: {
                applicantId: applicantId,
                ProgramId: programId
            }
        });

        return !!existingApplication;
    },

    // Check profile completion
    async getProfileCompletion(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                ApplicantProfile: true
            }
        });

        if (!user) {
            return { isComplete: false, completionPercentage: 0, missingFields: ['User not found'] };
        }

        const requiredFields = {
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            location: user.location,
            background: user.ApplicantProfile?.background,
            interests: user.ApplicantProfile?.interests
        };

        const filledFields = Object.values(requiredFields).filter(field => field && field.trim() !== '').length;
        const totalFields = Object.keys(requiredFields).length;
        const completionPercentage = Math.round((filledFields / totalFields) * 100);

        const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value || value.trim() === '')
            .map(([key]) => key);

        return {
            isComplete: completionPercentage === 100,
            completionPercentage,
            missingFields
        };
    },

    // Validate application data
    validateApplicationData(data: IApplicantApplicationData): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!data.programId || data.programId.trim() === '') {
            errors.push('Program ID is required');
        }

        if (!data.message || data.message.trim() === '') {
            errors.push('Application message is required');
        } else if (data.message.length < 50) {
            errors.push('Application message must be at least 50 characters long');
        } else if (data.message.length > 1000) {
            errors.push('Application message cannot exceed 1000 characters');
        }

        if (data.motivation && data.motivation.length > 500) {
            errors.push('Motivation cannot exceed 500 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Get application insights
    async getApplicationInsights(applicantId: string) {
        const applications = await applicantRepository.getMyApplications(applicantId);
        
        if (applications.length === 0) {
            return {
                totalApplications: 0,
                insights: []
            };
        }

        const insights: string[] = [];
        
        // Category analysis
        const categories = applications.map((app: any) => app.Program.category.name);
        const categoryCount = categories.reduce((acc: any, cat: string) => {
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});
        
        const mostAppliedCategory = Object.entries(categoryCount)
            .sort(([,a]: any, [,b]: any) => b - a)[0];
        
        if (mostAppliedCategory) {
            insights.push(`You've applied to ${mostAppliedCategory[1]} programs in ${mostAppliedCategory[0]}`);
        }

        // Success rate analysis
        const approvedApps = applications.filter((app: any) => app.status === 'APPROVED').length;
        const successRate = Math.round((approvedApps / applications.length) * 100);
        
        if (successRate > 70) {
            insights.push('Great job! You have a high application success rate');
        } else if (successRate < 30) {
            insights.push('Consider improving your application messages to increase success rate');
        }

        // Recent activity
        const recentApps = applications.filter((app: any) => {
            const appDate = new Date(app.createdAt);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return appDate >= thirtyDaysAgo;
        }).length;

        if (recentApps > 3) {
            insights.push('You\'ve been very active lately with applications');
        }

        return {
            totalApplications: applications.length,
            insights
        };
    },

    // Get recommended next steps
    async getRecommendedNextSteps(applicantId: string) {
        const completion = await this.getProfileCompletion(applicantId);
        const dashboard = await applicantRepository.getApplicantDashboard(applicantId);
        
        const recommendations: string[] = [];

        // Profile completion recommendations
        if (completion.completionPercentage < 100) {
            recommendations.push(`Complete your profile (${completion.completionPercentage}% done)`);
        }

        // Application recommendations
        if (dashboard.totalApplications === 0) {
            recommendations.push('Start by browsing available programs and applying to ones that interest you');
        } else if (dashboard.pendingApplications === 0 && dashboard.totalApplications < 5) {
            recommendations.push('Consider applying to more programs to increase your opportunities');
        }

        // Success rate recommendations
        if (dashboard.totalApplications > 3 && dashboard.successRate < 30) {
            recommendations.push('Review and improve your application messages for better success rates');
        }

        return recommendations;
    }
};
