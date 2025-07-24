import prisma from "../prisma";

// Common database utilities and helper functions
export const dbUtils = {
    // Health check
    async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: any }> {
        try {
            await prisma.$queryRaw`SELECT 1`;
            const userCount = await prisma.user.count();
            const programCount = await prisma.program.count();
            const applicationCount = await prisma.application.count();
            
            return {
                status: 'healthy',
                details: {
                    connected: true,
                    userCount,
                    programCount,
                    applicationCount,
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                details: {
                    connected: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date().toISOString()
                }
            };
        }
    },

    // Clean up old data
    async cleanupOldData(daysOld: number = 90): Promise<{ deletedCount: number }> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        // Delete old rejected applications
        const deletedApplications = await prisma.application.deleteMany({
            where: {
                status: 'REJECTED',
                updatedAt: {
                    lt: cutoffDate
                }
            }
        });

        return { deletedCount: deletedApplications.count };
    },

    // Get database statistics
    async getDatabaseStats() {
        const [
            totalUsers,
            totalPrograms,
            totalApplications,
            totalCategories,
            activePrograms,
            pendingApplications,
            artisans,
            applicants
        ] = await Promise.all([
            prisma.user.count(),
            prisma.program.count(),
            prisma.application.count(),
            prisma.herittageCategory.count(),
            prisma.program.count({ where: { isOpen: true } }),
            prisma.application.count({ where: { status: 'PENDING' } }),
            prisma.user.count({ where: { role: 'ARTISAN' } }),
            prisma.user.count({ where: { role: 'APPLICANT' } })
        ]);

        return {
            totalUsers,
            totalPrograms,
            totalApplications,
            totalCategories,
            activePrograms,
            pendingApplications,
            artisans,
            applicants,
            timestamp: new Date().toISOString()
        };
    },

    // Backup critical data
    async backupCriticalData() {
        const criticalData = {
            users: await prisma.user.findMany({
                include: {
                    ArtisanProfile: true,
                    ApplicantProfile: true
                }
            }),
            programs: await prisma.program.findMany({
                include: {
                    category: true,
                    artisan: { select: { id: true, name: true, email: true } }
                }
            }),
            categories: await prisma.herittageCategory.findMany(),
            timestamp: new Date().toISOString()
        };

        return criticalData;
    }
};

// Validation utilities
export const validationUtils = {
    // Validate email format
    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate phone number (Indonesian format)
    isValidPhoneNumber(phone: string): boolean {
        const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
        return phoneRegex.test(phone.replace(/\s+/g, ''));
    },

    // Validate URL format
    isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    // Sanitize user input
    sanitizeInput(input: string): string {
        return input
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/\s+/g, ' '); // Normalize whitespace
    },

    // Validate Indonesian location names
    isValidLocation(location: string): boolean {
        const minLength = 2;
        const maxLength = 100;
        const locationRegex = /^[a-zA-Z\s\u00C0-\u017F\u1E00-\u1EFF,-]+$/; // Allow letters, spaces, Indonesian chars, commas, hyphens
        
        return location.length >= minLength && 
               location.length <= maxLength && 
               locationRegex.test(location);
    },

    // Check password strength
    validatePasswordStrength(password: string): { isValid: boolean; score: number; feedback: string[] } {
        const feedback: string[] = [];
        let score = 0;

        if (password.length >= 8) {
            score += 1;
        } else {
            feedback.push('Password must be at least 8 characters long');
        }

        if (/[a-z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Password must contain lowercase letters');
        }

        if (/[A-Z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Password must contain uppercase letters');
        }

        if (/[0-9]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Password must contain numbers');
        }

        if (/[^a-zA-Z0-9]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Password must contain special characters');
        }

        return {
            isValid: score >= 4,
            score,
            feedback
        };
    }
};

// Date utilities
export const dateUtils = {
    // Format date for Indonesian locale
    formatDateID(date: Date): string {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    },

    // Get relative time (e.g., "2 hours ago")
    getRelativeTime(date: Date): string {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'baru saja';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} menit yang lalu`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} jam yang lalu`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} hari yang lalu`;
        } else {
            return this.formatDateID(date);
        }
    },

    // Check if date is within program duration
    isDateInProgramPeriod(date: Date, startDate: Date, endDate: Date): boolean {
        return date >= startDate && date <= endDate;
    },

    // Calculate age from birth date
    calculateAge(birthDate: Date): number {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    },

    // Get program duration in days
    getProgramDuration(startDate: Date, endDate: Date): number {
        const diffInTime = endDate.getTime() - startDate.getTime();
        return Math.ceil(diffInTime / (1000 * 3600 * 24));
    }
};

// String utilities
export const stringUtils = {
    // Generate slug from title
    createSlug(title: string): string {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    },

    // Truncate text with ellipsis
    truncate(text: string, maxLength: number): string {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    },

    // Capitalize first letter of each word
    titleCase(text: string): string {
        return text
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },

    // Generate random string
    generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    },

    // Extract keywords from text
    extractKeywords(text: string): string[] {
        const words = text
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3); // Only words longer than 3 characters

        // Remove duplicates
        return [...new Set(words)];
    }
};

// File utilities
export const fileUtils = {
    // Get file extension
    getFileExtension(filename: string): string {
        return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
    },

    // Validate image file
    isValidImageFile(filename: string): boolean {
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const extension = this.getFileExtension(filename).toLowerCase();
        return validExtensions.includes(extension);
    },

    // Validate document file
    isValidDocumentFile(filename: string): boolean {
        const validExtensions = ['pdf', 'doc', 'docx'];
        const extension = this.getFileExtension(filename).toLowerCase();
        return validExtensions.includes(extension);
    },

    // Generate unique filename
    generateUniqueFilename(originalFilename: string): string {
        const extension = this.getFileExtension(originalFilename);
        const baseName = originalFilename.replace(`.${extension}`, '');
        const timestamp = Date.now();
        const randomString = stringUtils.generateRandomString(6);
        
        return `${stringUtils.createSlug(baseName)}-${timestamp}-${randomString}.${extension}`;
    },

    // Format file size
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

// Analytics utilities
export const analyticsUtils = {
    // Calculate percentage change
    calculatePercentageChange(oldValue: number, newValue: number): number {
        if (oldValue === 0) return newValue > 0 ? 100 : 0;
        return Math.round(((newValue - oldValue) / oldValue) * 100);
    },

    // Calculate average
    calculateAverage(numbers: number[]): number {
        if (numbers.length === 0) return 0;
        const sum = numbers.reduce((acc, num) => acc + num, 0);
        return Math.round((sum / numbers.length) * 100) / 100;
    },

    // Calculate median
    calculateMedian(numbers: number[]): number {
        if (numbers.length === 0) return 0;
        
        const sorted = [...numbers].sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        
        if (sorted.length % 2 === 0) {
            return (sorted[middle - 1] + sorted[middle]) / 2;
        } else {
            return sorted[middle];
        }
    },

    // Generate date range for analytics
    generateDateRange(startDate: Date, endDate: Date): Date[] {
        const dates: Date[] = [];
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return dates;
    },

    // Calculate conversion rate
    calculateConversionRate(conversions: number, total: number): number {
        if (total === 0) return 0;
        return Math.round((conversions / total) * 100 * 100) / 100; // Two decimal places
    }
};

// Export all utilities
export const utils = {
    db: dbUtils,
    validation: validationUtils,
    date: dateUtils,
    string: stringUtils,
    file: fileUtils,
    analytics: analyticsUtils
};
