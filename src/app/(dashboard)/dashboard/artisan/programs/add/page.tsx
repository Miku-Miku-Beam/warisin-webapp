'use client';

import { categoryRepository } from '@/lib/repository/category.repository';
import { ICreateProgramData, programsRepository } from '@/lib/repository/program.repository';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Category {
    id: string;
    name: string;
}

interface FormData {
    title: string;
    description: string;
    duration: string;
    location: string;
    criteria: string;
    categoryId: string;
    startDate: string;
    endDate: string;
    programImageUrl: string;
    videoUrl: string;
    videoThumbnailUrl: string;
    isOpen: boolean;
}

const initialFormData: FormData = {
    title: '',
    description: '',
    duration: '',
    location: '',
    criteria: '',
    categoryId: '',
    startDate: '',
    endDate: '',
    programImageUrl: '',
    videoUrl: '',
    videoThumbnailUrl: '',
    isOpen: true,
};

export default function AddProgramPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load categories on component mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setIsLoading(true);
                const categoriesData = await fetch('/api/category');
                if (!categoriesData.ok) {
                    throw new Error('Failed to load categories');
                }
                const categories = await categoriesData.json();
                setCategories(categories);
            } catch (error) {
                console.error('Failed to load categories:', error);
                alert('Gagal memuat kategori');
            } finally {
                setIsLoading(false);
            }
        };

        loadCategories();
    }, []);

    // Handle input changes
    const handleInputChange = (field: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Judul program wajib diisi';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Deskripsi program wajib diisi';
        }

        if (!formData.duration.trim()) {
            newErrors.duration = 'Durasi program wajib diisi';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Lokasi program wajib diisi';
        }

        if (!formData.criteria.trim()) {
            newErrors.criteria = 'Kriteria peserta wajib diisi';
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Kategori program wajib dipilih';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Tanggal mulai wajib dipilih';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'Tanggal selesai wajib dipilih';
        }

        if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
            newErrors.endDate = 'Tanggal selesai harus setelah tanggal mulai';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // For now, use a dummy user ID - in real app this would come from auth
        const userId = 'dummy-artisan-id';

        if (!validateForm()) {
            alert('Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        setIsSubmitting(true);

        try {
            const programData: ICreateProgramData = {
                artisanId: userId,
                title: formData.title.trim(),
                description: formData.description.trim(),
                duration: formData.duration.trim(),
                location: formData.location.trim(),
                criteria: formData.criteria.trim(),
                categoryId: formData.categoryId,
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate),
                programImageUrl: formData.programImageUrl.trim() || undefined,
                videoUrl: formData.videoUrl.trim() || undefined,
                videoThumbnailUrl: formData.videoThumbnailUrl.trim() || undefined,
                isOpen: formData.isOpen,
            };

            await fetch('/api/program', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(programData),
            });

            alert('Program berhasil dibuat!');
            router.push('/dashboard/artisan/programs');
        } catch (error) {
            console.error('Failed to create program:', error);
            alert('Gagal membuat program. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle reset form
    const handleReset = () => {
        setFormData(initialFormData);
        setErrors({});
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3">Memuat data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Buat Program Baru</h1>
                    <p className="text-gray-600 mt-2">
                        Buat program pelatihan warisan budaya untuk dibagikan kepada masyarakat
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Informasi Dasar</h2>
                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Judul Program <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    placeholder="Masukkan judul program"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Deskripsi Program <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    placeholder="Jelaskan program Anda secara detail"
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategori <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="categoryId"
                                    value={formData.categoryId}
                                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.categoryId ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Pilih kategori program</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoryId && (
                                    <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>
                                )}
                            </div>

                            {/* Duration and Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                                        Durasi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="duration"
                                        placeholder="Contoh: 3 bulan, 12 minggu"
                                        value={formData.duration}
                                        onChange={(e) => handleInputChange('duration', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.duration ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.duration && (
                                        <p className="text-sm text-red-500 mt-1">{errors.duration}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                        Lokasi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        placeholder="Masukkan lokasi program"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.location && (
                                        <p className="text-sm text-red-500 mt-1">{errors.location}</p>
                                    )}
                                </div>
                            </div>

                            {/* Criteria */}
                            <div>
                                <label htmlFor="criteria" className="block text-sm font-medium text-gray-700 mb-2">
                                    Kriteria Peserta <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="criteria"
                                    placeholder="Jelaskan kriteria atau syarat untuk mengikuti program"
                                    rows={3}
                                    value={formData.criteria}
                                    onChange={(e) => handleInputChange('criteria', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.criteria ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.criteria && (
                                    <p className="text-sm text-red-500 mt-1">{errors.criteria}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Jadwal Program</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Start Date */}
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Mulai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={formData.startDate}
                                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.startDate ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.startDate && (
                                    <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>
                                )}
                            </div>

                            {/* End Date */}
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Selesai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    value={formData.endDate}
                                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.endDate ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.endDate && (
                                    <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Media Program</h2>
                        <p className="text-gray-600 mb-4">Tambahkan gambar dan video untuk program Anda (opsional)</p>
                        <div className="space-y-6">
                            {/* Program Image */}
                            <div>
                                <label htmlFor="programImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                    URL Gambar Program
                                </label>
                                <input
                                    type="url"
                                    id="programImageUrl"
                                    placeholder="https://example.com/image.jpg"
                                    value={formData.programImageUrl}
                                    onChange={(e) => handleInputChange('programImageUrl', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Video URL */}
                            <div>
                                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                    URL Video Program
                                </label>
                                <input
                                    type="url"
                                    id="videoUrl"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={formData.videoUrl}
                                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Video Thumbnail */}
                            <div>
                                <label htmlFor="videoThumbnailUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                    URL Thumbnail Video
                                </label>
                                <input
                                    type="url"
                                    id="videoThumbnailUrl"
                                    placeholder="https://example.com/thumbnail.jpg"
                                    value={formData.videoThumbnailUrl}
                                    onChange={(e) => handleInputChange('videoThumbnailUrl', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Pengaturan Program</h2>
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="isOpen"
                                checked={formData.isOpen}
                                onChange={(e) => handleInputChange('isOpen', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isOpen" className="text-sm font-medium text-gray-700">
                                Program terbuka untuk pendaftaran
                            </label>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 ml-7">
                            Jika dinonaktifkan, peserta tidak dapat mendaftar ke program ini
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Membuat Program...
                                </>
                            ) : (
                                'Buat Program'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                        >
                            Reset Form
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push('/dashboard/artisan/programs')}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none bg-white text-gray-700 px-6 py-3 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
