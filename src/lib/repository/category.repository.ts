import prisma from "../prisma";

interface ICreateCategoryData {
    name: string;
}

interface IUpdateCategoryData {
    name?: string;
}

interface ICategoryRepository {
    // Category management
    getAllCategories(): Promise<any[]>;
    getCategoryById(id: string): Promise<any | null>;
    getCategoryByName(name: string): Promise<any | null>;
    createCategory(data: ICreateCategoryData): Promise<any>;
    updateCategory(id: string, data: IUpdateCategoryData): Promise<any>;
    deleteCategory(id: string): Promise<void>;
    
    // Category with statistics
    getCategoriesWithStats(): Promise<any[]>;
    getCategoryStats(id: string): Promise<any>;
    
    // Category programs
    getProgramsByCategory(categoryId: string): Promise<any[]>;
}

const categoryRepository: ICategoryRepository = {
    // Category management
    async getAllCategories() {
        return await prisma.herittageCategory.findMany({
            orderBy: {
                name: 'asc'
            }
        });
    },

    async getCategoryById(id: string) {
        return await prisma.herittageCategory.findUnique({
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

    async getCategoryByName(name: string) {
        return await prisma.herittageCategory.findUnique({
            where: { name },
            include: {
                Program: {
                    select: {
                        id: true,
                        title: true,
                        isOpen: true
                    }
                }
            }
        });
    },

    async createCategory(data: ICreateCategoryData) {
        return await prisma.herittageCategory.create({
            data: {
                name: data.name
            }
        });
    },

    async updateCategory(id: string, data: IUpdateCategoryData) {
        return await prisma.herittageCategory.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name })
            }
        });
    },

    async deleteCategory(id: string) {
        // Check if category has programs
        const categoryWithPrograms = await prisma.herittageCategory.findUnique({
            where: { id },
            include: {
                Program: {
                    select: { id: true }
                }
            }
        });

        if (categoryWithPrograms && categoryWithPrograms.Program.length > 0) {
            throw new Error('Cannot delete category that has programs associated with it');
        }

        await prisma.herittageCategory.delete({
            where: { id }
        });
    },

    // Category with statistics
    async getCategoriesWithStats() {
        const categories = await prisma.herittageCategory.findMany({
            include: {
                Program: {
                    select: {
                        id: true,
                        isOpen: true,
                        startDate: true,
                        endDate: true,
                        applications: {
                            select: {
                                id: true,
                                status: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        return categories.map(category => {
            const totalPrograms = category.Program.length;
            const activePrograms = category.Program.filter(p => p.isOpen).length;
            const upcomingPrograms = category.Program.filter(p => 
                new Date(p.startDate) > new Date()
            ).length;
            const ongoingPrograms = category.Program.filter(p => 
                new Date(p.startDate) <= new Date() && new Date(p.endDate) >= new Date()
            ).length;
            const totalApplications = category.Program.reduce((acc, program) => 
                acc + program.applications.length, 0
            );

            return {
                ...category,
                stats: {
                    totalPrograms,
                    activePrograms,
                    upcomingPrograms,
                    ongoingPrograms,
                    totalApplications,
                    avgApplicationsPerProgram: totalPrograms > 0 
                        ? Math.round(totalApplications / totalPrograms) 
                        : 0
                }
            };
        });
    },

    async getCategoryStats(id: string) {
        const category = await prisma.herittageCategory.findUnique({
            where: { id },
            include: {
                Program: {
                    include: {
                        applications: {
                            select: {
                                id: true,
                                status: true,
                                createdAt: true
                            }
                        },
                        artisan: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if (!category) return null;

        const totalPrograms = category.Program.length;
        const activePrograms = category.Program.filter(p => p.isOpen).length;
        const totalApplications = category.Program.reduce((acc, program) => 
            acc + program.applications.length, 0
        );
        
        // Get unique artisans in this category
        const uniqueArtisans = new Set(category.Program.map(p => p.artisan.id)).size;
        
        // Get applications from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentApplications = category.Program.reduce((acc, program) => 
            acc + program.applications.filter(app => 
                new Date(app.createdAt) >= thirtyDaysAgo
            ).length, 0
        );

        // Most popular program in this category
        let mostPopularProgram = null;
        if (category.Program.length > 0) {
            mostPopularProgram = category.Program.reduce((max, program) => {
                if (!max) return program;
                return program.applications.length > max.applications.length ? program : max;
            });
        }

        return {
            ...category,
            stats: {
                totalPrograms,
                activePrograms,
                totalApplications,
                uniqueArtisans,
                recentApplications,
                avgApplicationsPerProgram: totalPrograms > 0 
                    ? Math.round(totalApplications / totalPrograms) 
                    : 0,
                mostPopularProgram: mostPopularProgram ? {
                    id: mostPopularProgram.id,
                    title: mostPopularProgram.title,
                    applications: mostPopularProgram.applications.length
                } : null
            }
        };
    },

    // Category programs
    async getProgramsByCategory(categoryId: string) {
        return await prisma.program.findMany({
            where: {
                categoryId: categoryId
            },
            include: {
                category: true,
                artisan: {
                    select: {
                        id: true,
                        name: true,
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
        });
    }
};

// Export repository
export { categoryRepository };

// Export interfaces
    export type { ICategoryRepository, ICreateCategoryData, IUpdateCategoryData };

// Category utility functions
export const categoryUtils = {
    // Get trending categories (most applications in last 30 days)
    async getTrendingCategories(limit: number = 5) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const categories = await categoryRepository.getCategoriesWithStats();
        
        // Sort by recent applications
        return categories
            .sort((a, b) => {
                const aRecentApps = a.Program.reduce((acc: number, program: any) => 
                    acc + program.applications.filter((app: any) => 
                        new Date(app.createdAt) >= thirtyDaysAgo
                    ).length, 0
                );
                
                const bRecentApps = b.Program.reduce((acc: number, program: any) => 
                    acc + program.applications.filter((app: any) => 
                        new Date(app.createdAt) >= thirtyDaysAgo
                    ).length, 0
                );
                
                return bRecentApps - aRecentApps;
            })
            .slice(0, limit);
    },

    // Get category popularity score
    async getCategoryPopularity(categoryId: string) {
        const stats = await categoryRepository.getCategoryStats(categoryId);
        if (!stats) return 0;

        // Calculate popularity based on multiple factors
        const programsWeight = Math.min(stats.stats.totalPrograms / 10, 1) * 30; // Max 30 points
        const applicationsWeight = Math.min(stats.stats.totalApplications / 50, 1) * 40; // Max 40 points
        const artisansWeight = Math.min(stats.stats.uniqueArtisans / 5, 1) * 20; // Max 20 points
        const activityWeight = Math.min(stats.stats.recentApplications / 20, 1) * 10; // Max 10 points

        return Math.round(programsWeight + applicationsWeight + artisansWeight + activityWeight);
    },

    // Suggest categories for new programs based on artisan expertise
    async suggestCategoriesForArtisan(artisanId: string) {
        const artisan = await prisma.user.findUnique({
            where: { id: artisanId },
            include: {
                ArtisanProfile: true,
                ArtisanPrograms: {
                    include: {
                        category: true
                    }
                }
            }
        });

        if (!artisan || !artisan.ArtisanProfile) return [];

        // Get existing categories the artisan has used
        const usedCategories = artisan.ArtisanPrograms.map(p => p.category.id);
        
        // Get all categories
        const allCategories = await categoryRepository.getAllCategories();
        
        // Filter out already used categories
        const unusedCategories = allCategories.filter(cat => !usedCategories.includes(cat.id));
        
        // Simple keyword matching with expertise
        const expertise = artisan.ArtisanProfile.expertise.toLowerCase();
        const suggestedCategories = unusedCategories.filter(category => {
            const categoryName = category.name.toLowerCase();
            return expertise.includes(categoryName) || categoryName.includes(expertise);
        });

        return suggestedCategories.slice(0, 3); // Return top 3 suggestions
    },

    // Validate category name
    validateCategoryName(name: string): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!name || name.trim().length === 0) {
            errors.push('Category name is required');
        }

        if (name.length < 2) {
            errors.push('Category name must be at least 2 characters long');
        }

        if (name.length > 50) {
            errors.push('Category name cannot exceed 50 characters');
        }

        // Check for special characters (allow only letters, numbers, spaces, and common Indonesian characters)
        const validPattern = /^[a-zA-Z0-9\s\u00C0-\u017F\u1E00-\u1EFF]+$/;
        if (!validPattern.test(name)) {
            errors.push('Category name contains invalid characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Get category growth metrics
    async getCategoryGrowth(categoryId: string, months: number = 6) {
        const category = await categoryRepository.getCategoryById(categoryId);
        if (!category) return null;

        const growthData = [];
        
        for (let i = months - 1; i >= 0; i--) {
            const monthStart = new Date();
            monthStart.setMonth(monthStart.getMonth() - i);
            monthStart.setDate(1);
            monthStart.setHours(0, 0, 0, 0);
            
            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthEnd.getMonth() + 1);

            const monthlyPrograms = category.Program.filter((p: any) => {
                const programDate = new Date(p.createdAt);
                return programDate >= monthStart && programDate < monthEnd;
            }).length;

            const monthlyApplications = category.Program.reduce((acc: number, program: any) => {
                return acc + program.applications.filter((app: any) => {
                    const appDate = new Date(app.createdAt);
                    return appDate >= monthStart && appDate < monthEnd;
                }).length;
            }, 0);

            growthData.push({
                month: monthStart.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
                programs: monthlyPrograms,
                applications: monthlyApplications
            });
        }

        return growthData;
    }
};
