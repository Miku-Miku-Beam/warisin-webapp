import prisma from "./prisma";

// Categories utilities
export const categoriesUtils = {
    // Get all heritage categories
    async getAllCategories() {
        return await prisma.herittageCategory.findMany({
            orderBy: {
                name: 'asc'
            }
        });
    },

    // Get category by id with programs
    async getCategoryById(id: string) {
        return await prisma.herittageCategory.findUnique({
            where: { id },
            include: {
                Program: {
                    where: {
                        isOpen: true
                    },
                    include: {
                        artisan: {
                            select: {
                                id: true,
                                name: true,
                                profileImageUrl: true,
                                location: true
                            }
                        },
                        applications: {
                            select: {
                                id: true,
                                status: true
                            }
                        }
                    }
                }
            }
        });
    },

    // Get categories with program counts
    async getCategoriesWithStats() {
        const categories = await prisma.herittageCategory.findMany({
            include: {
                Program: {
                    select: {
                        id: true,
                        isOpen: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        return categories.map(category => ({
            ...category,
            totalPrograms: category.Program.length,
            activePrograms: category.Program.filter(p => p.isOpen).length
        }));
    }
};

// Users utilities
export const usersUtils = {
    // Get user profile with related data
    async getUserProfile(userId: string) {
        return await prisma.user.findUnique({
            where: { id: userId },
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

    // Get all artisans with their profiles
    async getAllArtisans() {
        return await prisma.user.findMany({
            where: {
                role: 'ARTISAN'
            },
            include: {
                ArtisanProfile: true,
                ArtisanPrograms: {
                    select: {
                        id: true,
                        title: true,
                        isOpen: true,
                        category: {
                            select: {
                                name: true
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

    // Get artisan by id with full details
    async getArtisanById(id: string) {
        return await prisma.user.findUnique({
            where: { 
                id: id,
                role: 'ARTISAN'
            },
            include: {
                ArtisanProfile: true,
                ArtisanPrograms: {
                    include: {
                        category: true,
                        applications: {
                            select: {
                                id: true,
                                status: true,
                                applicant: {
                                    select: {
                                        id: true,
                                        name: true,
                                        profileImageUrl: true
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
    }
};

// Global platform statistics
export const platformStats = {
    // Get platform overview statistics
    async getOverviewStats() {
        const [
            totalUsers,
            totalArtisans,
            totalApplicants,
            totalPrograms,
            activePrograms,
            totalApplications,
            totalCategories
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'ARTISAN' } }),
            prisma.user.count({ where: { role: 'APPLICANT' } }),
            prisma.program.count(),
            prisma.program.count({ where: { isOpen: true } }),
            prisma.application.count(),
            prisma.herittageCategory.count()
        ]);

        return {
            totalUsers,
            totalArtisans,
            totalApplicants,
            totalPrograms,
            activePrograms,
            totalApplications,
            totalCategories
        };
    },

    // Get monthly statistics for charts
    async getMonthlyStats(months: number = 6) {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        const monthlyData = [];
        
        for (let i = 0; i < months; i++) {
            const monthStart = new Date();
            monthStart.setMonth(monthStart.getMonth() - i);
            monthStart.setDate(1);
            monthStart.setHours(0, 0, 0, 0);
            
            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            
            const [newUsers, newPrograms, newApplications] = await Promise.all([
                prisma.user.count({
                    where: {
                        createdAt: {
                            gte: monthStart,
                            lt: monthEnd
                        }
                    }
                }),
                prisma.program.count({
                    where: {
                        createdAt: {
                            gte: monthStart,
                            lt: monthEnd
                        }
                    }
                }),
                prisma.application.count({
                    where: {
                        createdAt: {
                            gte: monthStart,
                            lt: monthEnd
                        }
                    }
                })
            ]);

            monthlyData.unshift({
                month: monthStart.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
                newUsers,
                newPrograms,
                newApplications
            });
        }

        return monthlyData;
    }
};

// Search utilities
export const searchUtils = {
    // Search programs by title, description, or category
    async searchPrograms(query: string, categoryId?: string) {
        const whereClause: any = {
            isOpen: true,
            OR: [
                {
                    title: {
                        contains: query,
                        mode: 'insensitive'
                    }
                },
                {
                    description: {
                        contains: query,
                        mode: 'insensitive'
                    }
                },
                {
                    criteria: {
                        contains: query,
                        mode: 'insensitive'
                    }
                }
            ]
        };

        if (categoryId) {
            whereClause.categoryId = categoryId;
        }

        return await prisma.program.findMany({
            where: whereClause,
            include: {
                category: true,
                artisan: {
                    select: {
                        id: true,
                        name: true,
                        profileImageUrl: true,
                        location: true,
                        ArtisanProfile: true
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
            }
        });
    },

    // Search artisans by name, expertise, or location
    async searchArtisans(query: string) {
        return await prisma.user.findMany({
            where: {
                role: 'ARTISAN',
                OR: [
                    {
                        name: {
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
                        ArtisanProfile: {
                            expertise: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    }
                ]
            },
            include: {
                ArtisanProfile: true,
                ArtisanPrograms: {
                    where: {
                        isOpen: true
                    },
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
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
};


import {
    generateUploadButton,
    generateUploadDropzone,
} from "@uploadthing/react";
import { OurFileRouter } from "./uploadthing";


export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
