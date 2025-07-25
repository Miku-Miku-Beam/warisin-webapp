import { getStorage } from 'firebase-admin/storage';
import { app } from './admin';

export const storage = getStorage(app);

export interface UploadResult {
    url: string;
    fileName: string;
    size: number;
    path: string;
}

export interface UploadOptions {
    maxSize?: number; // in bytes, default 10MB
    allowedTypes?: string[];
    customFileName?: string;
}

// Default file type configurations
const FILE_TYPE_CONFIGS = {
    image: {
        allowedTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif'
        ],
        maxSize: 5 * 1024 * 1024, // 5MB
        extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif']
    },
    document: {
        allowedTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        maxSize: 10 * 1024 * 1024, // 10MB
        extensions: ['pdf', 'doc', 'docx']
    },
    media: {
        allowedTypes: [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'video/mp4', 'video/webm', 'video/quicktime',
            'audio/mpeg', 'audio/wav'
        ],
        maxSize: 50 * 1024 * 1024, // 50MB
        extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'webm', 'mov', 'mp3', 'wav']
    }
};

interface IUploadFileParams {
    fileBuffer: Buffer; // File buffer to upload
    fileName: string; // Original file name
    mimeType: string; // MIME type of the file
    storagePath: string; // Path in Firebase Storage to upload the file
    options?: UploadOptions; // Optional upload options
};
/**
 * Upload file to Firebase Storage with flexible path structure
 */
export const uploadFile = async (
    params: IUploadFileParams
): Promise<UploadResult> => {
    try {
        const {
            fileBuffer,
            fileName,
            mimeType,
            storagePath,
            options
        } = params;

        
        const {
            maxSize = 10 * 1024 * 1024, // 10MB default
            allowedTypes = [],
            customFileName
        } = options || {};

        console.log(`Uploading file: ${fileName} to ${storagePath} with MIME type ${mimeType}`);

        // Validate file type if specified
        if (allowedTypes.length > 0 && !allowedTypes.includes(mimeType)) {
            throw new Error(`File type ${mimeType} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
        }

        // Validate file size
        if (fileBuffer.length > maxSize) {
            throw new Error(`File size must be less than ${formatFileSize(maxSize)}`);
        }

        // Generate filename
        const timestamp = Date.now();
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
        const finalFileName = customFileName || `${timestamp}_${fileName}`;

        // Create full storage path
        const fullPath = `${storagePath}/${finalFileName}`;

        // Create storage reference
        const fileRef = storage.bucket(
            process.env.FIREBASE_STORAGE_BUCKET
        ).file(fullPath);

        // Upload file with metadata
        await fileRef.save(fileBuffer, {
            metadata: {
                contentType: mimeType,
                metadata: {
                    originalName: fileName,
                    uploadedAt: new Date().toISOString()
                }
            },
            public: true // Make file publicly accessible
        });

        // Get download URL
        const [url] = await fileRef.getSignedUrl({
            action: 'read',
            expires: '03-01-2500' // Long expiry for public files
        });

        console.log(`File uploaded successfully: ${url}`);  

        return {
            url,
            fileName: finalFileName,
            size: fileBuffer.length,
            path: fullPath
        };

    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

/**
 * Delete file from Firebase Storage
 */
export const deleteFile = async (filePath: string): Promise<void> => {
    try {
        const fileRef = storage.bucket().file(filePath);
        await fileRef.delete();
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
};

/**
 * Upload user profile image
 */
export const uploadUserProfile = async (
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    userId: string
): Promise<UploadResult> => {
    const storagePath = `users/${userId}`;
    const customFileName = 'profile.jpg'; // Fixed filename as per rules

    return uploadFile({
        fileBuffer,
        fileName,
        mimeType,
        storagePath,
        options: {
            ...FILE_TYPE_CONFIGS.image,
            customFileName
        }
    });
};

/**
 * Upload artisan files (profile or works)
 */
export const uploadArtisanFile = async (
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    userId: string,
    folder: 'profile' | 'works'
): Promise<UploadResult> => {
    const storagePath = `artisans/${userId}/${folder}`;

    return uploadFile({
        fileBuffer,
        fileName,
        mimeType,
        storagePath,
        options: {
            ...(folder === 'profile' ? FILE_TYPE_CONFIGS.image : FILE_TYPE_CONFIGS.media)
        }
    });
};

/**
 * Upload program files (program-image or gallery)
 */
export const uploadProgramFile = async (
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    programId: string,
    folder: 'program-image' | 'gallery'
): Promise<UploadResult> => {
    const storagePath = `programs/${programId}/${folder}`;
    
    return uploadFile({
        fileBuffer,
        fileName,
        mimeType,
        storagePath,
        options: {
            ...(folder === 'program-image' ? FILE_TYPE_CONFIGS.image : FILE_TYPE_CONFIGS.media)
        }
    });
};

/**
 * Upload testimony files
 */
export const uploadTestimonyFile = async (
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    programId: string,
    userId: string
): Promise<UploadResult> => {
    const storagePath = `testimony/${programId}/${userId}`;

    return uploadFile({
        fileBuffer,
        fileName,
        mimeType,
        storagePath,
        options: {
            ...FILE_TYPE_CONFIGS.media
        }
    });
};

/**
 * Upload application CV
 */
export const uploadApplicationCV = async (
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    applicationId: string
): Promise<UploadResult> => {
    const storagePath = `applications/${applicationId}`;
    const customFileName = 'cv.pdf'; // Fixed filename as per rules

    return uploadFile({
        fileBuffer,
        fileName,
        mimeType,
        storagePath,
        options: {
            ...FILE_TYPE_CONFIGS.document,
            customFileName
        }
    });
};

/**
 * Utility functions
 */

// Validate file before upload
export const validateFile = (
    fileName: string,
    mimeType: string,
    fileSize: number,
    type: 'image' | 'document' | 'media'
): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const config = FILE_TYPE_CONFIGS[type];

    // Check file type
    if (!config.allowedTypes.includes(mimeType)) {
        errors.push(`File type ${mimeType} is not allowed. Allowed types: ${config.allowedTypes.join(', ')}`);
    }

    // Check file size
    if (fileSize > config.maxSize) {
        errors.push(`File size must be less than ${formatFileSize(config.maxSize)}`);
    }

    // Check file extension
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    if (!fileExtension || !config.extensions.includes(fileExtension)) {
        errors.push(`File extension .${fileExtension} is not allowed. Allowed extensions: ${config.extensions.join(', ')}`);
    }

    // Check filename length
    if (fileName.length > 100) {
        errors.push('File name is too long (max 100 characters)');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Format file size for human reading
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Extract filename from Firebase URL
export const extractFileNameFromUrl = (url: string): string | null => {
    try {
        const urlParts = url.split('/');
        const fileNameWithToken = urlParts[urlParts.length - 1];
        const fileName = fileNameWithToken.split('?')[0];
        return decodeURIComponent(fileName);
    } catch (error) {
        console.error('Error extracting filename:', error);
        return null;
    }
};

// Get file metadata
export const getFileMetadata = async (filePath: string) => {
    try {
        const fileRef = storage.bucket().file(filePath);
        const [metadata] = await fileRef.getMetadata();
        return metadata;
    } catch (error) {
        console.error('Error getting file metadata:', error);
        return null;
    }
};

// Check if file exists
export const fileExists = async (filePath: string): Promise<boolean> => {
    try {
        const fileRef = storage.bucket().file(filePath);
        const [exists] = await fileRef.exists();
        return exists;
    } catch (error) {
        console.error('Error checking file existence:', error);
        return false;
    }
};

// List files in a directory
export const listFiles = async (directoryPath: string) => {
    try {
        const [files] = await storage.bucket().getFiles({
            prefix: directoryPath
        });

        return files.map(file => ({
            name: file.name,
            path: file.name,
            size: file.metadata.size,
            updated: file.metadata.updated,
            contentType: file.metadata.contentType
        }));
    } catch (error) {
        console.error('Error listing files:', error);
        return [];
    }
};

// Convert File object to Buffer (for API routes)
export const fileToBuffer = async (file: File): Promise<Buffer> => {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
};

// Get storage usage for a path
export const getStorageUsage = async (basePath: string): Promise<{ totalFiles: number; totalSize: number }> => {
    try {
        const files = await listFiles(basePath);
        const totalFiles = files.length;
        const totalSize = files.reduce((sum, file) => sum + parseInt(String(file.size || '0')), 0);

        return { totalFiles, totalSize };
    } catch (error) {
        console.error('Error getting storage usage:', error);
        return { totalFiles: 0, totalSize: 0 };
    }
};

// Cleanup old files (useful for temporary uploads)
export const cleanupOldFiles = async (directoryPath: string, olderThanDays: number = 7): Promise<number> => {
    try {
        const files = await listFiles(directoryPath);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

        let deletedCount = 0;

        for (const file of files) {
            const fileDate = new Date(file.updated || Date.now());
            if (fileDate < cutoffDate) {
                await deleteFile(file.path);
                deletedCount++;
            }
        }

        return deletedCount;
    } catch (error) {
        console.error('Error cleaning up old files:', error);
        return 0;
    }
};