import prisma from "../prisma";

interface ICreateUserData {
    email: string;
    name?: string;
    role: 'ARTISAN' | 'APPLICANT';
    bio?: string;
    profileImageUrl?: string;
    location?: string;
    authId: string;
}

interface IUpdateUserData {
    name?: string;
    bio?: string;
    profileImageUrl?: string;
    location?: string;
}

interface IUserRepository {
    // User management
    getUserById(id: string): Promise<any | null>;
    getUserByAuthId(authId: string): Promise<any | null>;
    getUserByEmail(email: string): Promise<any | null>;
    createUser(data: ICreateUserData): Promise<any>;
    updateUser(id: string, data: IUpdateUserData): Promise<any>;
    deleteUser(id: string): Promise<void>;
    
    // User queries
    getAllArtisans(): Promise<any[]>;
    getAllApplicants(): Promise<any[]>;
    searchUsers(query: string, role?: 'ARTISAN' | 'APPLICANT'): Promise<any[]>;
    
    // User statistics
    getUserStats(): Promise<any>;
}

const userRepository: IUserRepository = {
    // User management
    async getUserById(id: string) {
        return await prisma.user.findUnique({
            where: { id },
            include: {
                ArtisanProfile: true,
                ApplicantProfile: true,
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
                },
                Application: {
                    include: {
                        Program: {
                            include: {
                                category: true,
                                artisan: {
                                    select: {
                                        id: true,
                                        name: true,
                                        profileImageUrl: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    },

    async getUserByAuthId(authId: string) {
        return await prisma.user.findUnique({
            where: { authId },
            include: {
                ArtisanProfile: true,
                ApplicantProfile: true
            }
        });
    },

    async getUserByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
            include: {
                ArtisanProfile: true,
                ApplicantProfile: true
            }
        });
    },

    async createUser(data: ICreateUserData) {
        return await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                role: data.role,
                bio: data.bio,
                profileImageUrl: data.profileImageUrl,
                location: data.location,
                authId: data.authId,
            },
            include: {
                ArtisanProfile: true,
                ApplicantProfile: true
            }
        });
    },

    async updateUser(id: string, data: IUpdateUserData) {
        return await prisma.user.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.bio !== undefined && { bio: data.bio }),
                ...(data.profileImageUrl !== undefined && { profileImageUrl: data.profileImageUrl }),
                ...(data.location !== undefined && { location: data.location }),
            },
            include: {
                ArtisanProfile: true,
                ApplicantProfile: true
            }
        });
    },

    async deleteUser(id: string) {
        await prisma.user.delete({
            where: { id }
        });
    },

    // User queries
    async getAllArtisans() {
        return await prisma.user.findMany({
            where: {
                role: 'ARTISAN'
            },
            include: {
                ArtisanProfile: true,
                ArtisanPrograms: {
                    include: {
                        category: {
                            select: {
                                name: true
                            }
                        },
                        applications: {
                            select: {
                                id: true,
                                status: true
                            }
                        }
                    },
                    where: {
                        isOpen: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },

    async getAllApplicants() {
        return await prisma.user.findMany({
            where: {
                role: 'APPLICANT'
            },
            include: {
                ApplicantProfile: true,
                Application: {
                    include: {
                        Program: {
                            select: {
                                id: true,
                                title: true,
                                category: {
                                    select: {
                                        name: true
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

    async searchUsers(query: string, role?: 'ARTISAN' | 'APPLICANT') {
        const whereClause: any = {
            OR: [
                {
                    name: {
                        contains: query,
                        mode: 'insensitive'
                    }
                },
                {
                    email: {
                        contains: query,
                        mode: 'insensitive'
                    }
                },
                {
                    location: {
                        contains: query,
                        mode: 'insensitive'
                    }
                },
                {
                    bio: {
                        contains: query,
                        mode: 'insensitive'
                    }
                }
            ]
        };

        if (role) {
            whereClause.role = role;
        }

        return await prisma.user.findMany({
            where: whereClause,
            include: {
                ArtisanProfile: true,
                ApplicantProfile: true,
                ArtisanPrograms: role === 'ARTISAN' ? {
                    select: {
                        id: true,
                        title: true,
                        category: {
                            select: {
                                name: true
                            }
                        }
                    }
                } : false,
                Application: role === 'APPLICANT' ? {
                    select: {
                        id: true,
                        status: true,
                        Program: {
                            select: {
                                title: true
                            }
                        }
                    }
                } : false
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },

    // User statistics
    async getUserStats() {
        const [
            totalUsers,
            totalArtisans,
            totalApplicants,
            newUsersThisMonth,
            usersWithProfiles
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'ARTISAN' } }),
            prisma.user.count({ where: { role: 'APPLICANT' } }),
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            }),
            prisma.user.count({
                where: {
                    OR: [
                        { ArtisanProfile: { isNot: null } },
                        { ApplicantProfile: { isNot: null } }
                    ]
                }
            })
        ]);

        return {
            totalUsers,
            totalArtisans,
            totalApplicants,
            newUsersThisMonth,
            usersWithProfiles,
            profileCompletionRate: totalUsers > 0 ? Math.round((usersWithProfiles / totalUsers) * 100) : 0
        };
    }
};

// Export repository
export { userRepository };

// Export interfaces
    export type { ICreateUserData, IUpdateUserData, IUserRepository };

// User utility functions
export const userUtils = {
    // Get user profile completion percentage
    async getProfileCompletion(userId: string) {
        const user = await userRepository.getUserById(userId);
        if (!user) return 0;

        let score = 0;
        const maxScore = 10;

        // Basic user info (4 points)
        if (user.name) score += 1;
        if (user.bio) score += 1;
        if (user.profileImageUrl) score += 1;
        if (user.location) score += 1;

        // Role-specific profile (6 points)
        if (user.role === 'ARTISAN' && user.ArtisanProfile) {
            if (user.ArtisanProfile.story) score += 2;
            if (user.ArtisanProfile.expertise) score += 2;
            if (user.ArtisanProfile.works && user.ArtisanProfile.works.length > 0) score += 1;
            if (user.ArtisanProfile.imageUrl) score += 1;
        } else if (user.role === 'APPLICANT' && user.ApplicantProfile) {
            if (user.ApplicantProfile.background) score += 2;
            if (user.ApplicantProfile.interests) score += 2;
            if (user.ApplicantProfile.portfolioUrl) score += 2;
        }

        return Math.round((score / maxScore) * 100);
    },

    // Get user activity summary
    async getUserActivity(userId: string) {
        const user = await userRepository.getUserById(userId);
        if (!user) return null;

        if (user.role === 'ARTISAN') {
            const totalPrograms = user.ArtisanPrograms.length;
            const activePrograms = user.ArtisanPrograms.filter((p: any) => p.isOpen).length;
            const totalApplications = user.ArtisanPrograms.reduce((acc: number, program: any) => 
                acc + program.applications.length, 0
            );

            return {
                type: 'artisan',
                totalPrograms,
                activePrograms,
                totalApplications,
                joinedDate: user.createdAt
            };
        } else {
            const totalApplications = user.Application.length;
            const pendingApplications = user.Application.filter((app: any) => app.status === 'PENDING').length;
            const approvedApplications = user.Application.filter((app: any) => app.status === 'APPROVED').length;

            return {
                type: 'applicant',
                totalApplications,
                pendingApplications,
                approvedApplications,
                joinedDate: user.createdAt
            };
        }
    },

    // Check if user can create programs (for artisans)
    async canCreateProgram(user: any): Promise<{ canCreate: boolean; reason?: string }> {
        if (user.role !== 'ARTISAN') {
            return { canCreate: false, reason: 'Only artisans can create programs' };
        }

        if (!user.ArtisanProfile) {
            return { canCreate: false, reason: 'Please complete your artisan profile first' };
        }

        const profileCompletion = await this.getProfileCompletion(user.id);
        if (profileCompletion < 70) {
            return { canCreate: false, reason: 'Please complete at least 70% of your profile' };
        }

        return { canCreate: true };
    },

    // Check if user can apply to programs (for applicants)
    canApplyToPrograms(user: any): { canApply: boolean; reason?: string } {
        if (user.role !== 'APPLICANT') {
            return { canApply: false, reason: 'Only applicants can apply to programs' };
        }

        if (!user.ApplicantProfile) {
            return { canApply: false, reason: 'Please complete your applicant profile first' };
        }

        return { canApply: true };
    },

    // Generate user display name
    getDisplayName(user: any): string {
        if (user.name) return user.name;
        if (user.email) return user.email.split('@')[0];
        return `User ${user.id.slice(0, 8)}`;
    },

    // Get user avatar URL with fallback
    getAvatarUrl(user: any): string {
        if (user.profileImageUrl) return user.profileImageUrl;
        
        // Generate avatar based on user name/email
        const name = this.getDisplayName(user);
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=f59e0b&color=ffffff&size=150`;
    }
};
