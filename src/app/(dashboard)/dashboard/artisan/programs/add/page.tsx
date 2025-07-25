"use client";

import { categoryRepository } from "@/lib/repository/category.repository";
import { ICreateProgramData } from "@/lib/repository/program.repository";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  title: "",
  description: "",
  duration: "",
  location: "",
  criteria: "",
  categoryId: "",
  startDate: "",
  endDate: "",
  programImageUrl: "",
  videoUrl: "",
  videoThumbnailUrl: "",
  isOpen: true,
};

export default function AddProgramPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiAssisting, setIsAiAssisting] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await fetch("/api/category");
        if (!categoriesData.ok) {
          throw new Error("Failed to load categories");
        }
        const categories = await categoriesData.json();
        setCategories(categories);
      } catch (error) {
        console.error("Failed to load categories:", error);
        alert("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Handle input changes
  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Program title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Program description is required";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Program duration is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Program location is required";
    }

    if (!formData.criteria.trim()) {
      newErrors.criteria = "Participant criteria is required";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Program category is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) >= new Date(formData.endDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For now, use a dummy user ID - in real app this would come from auth
    const userId = "dummy-artisan-id";

    if (!validateForm()) {
      alert("Please complete all required fields");
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

      await fetch("/api/program", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(programData),
      });

      alert("Program created successfully!");
      router.push("/dashboard/artisan/programs");
    } catch (error) {
      console.error("Failed to create program:", error);
      alert("Failed to create program. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle AI Assistant
  const handleAiAssist = async () => {
    if (!aiPrompt.trim()) {
      alert("Please enter ideas or keywords for your program description");
      return;
    }

    setIsAiAssisting(true);

    try {
      // Get category name for better context
      const selectedCategory = categories.find(
        (cat) => cat.id === formData.categoryId
      );

      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          programTitle: formData.title || "Cultural Heritage Program",
          category: selectedCategory?.name || "Cultural Heritage",
          duration: formData.duration || "",
          location: formData.location || "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.success && data.generatedDescription) {
        // Update description with AI generated text
        handleInputChange("description", data.generatedDescription);
        setShowAiAssistant(false);
        setAiPrompt("");

        if (data.fallback) {
          alert(
            "AI service had issues, but we've generated a basic description template for you. Please review and customize it as needed."
          );
        } else {
          alert(
            "Description successfully generated by AI! You can edit it as needed."
          );
        }
      } else {
        throw new Error(data.error || "No description generated");
      }
    } catch (error) {
      console.error("AI Assistant error:", error);

      let errorMessage =
        "Failed to generate description with AI. Please try again or write manually.";

      if (error instanceof Error) {
        if (
          error.message.includes("API key authentication failed") ||
          error.message.includes("API access denied")
        ) {
          errorMessage =
            "AI service configuration error. Please contact support.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage =
            "Too many requests. Please wait a moment and try again.";
        } else if (error.message.includes("temporarily unavailable")) {
          errorMessage =
            "AI service is temporarily unavailable. Please try again in a few minutes.";
        } else if (error.message.includes("safety filters")) {
          errorMessage =
            "Your input was blocked by content filters. Please try rephrasing your description.";
        } else if (error.message.includes("Invalid request format")) {
          errorMessage =
            "Invalid input format. Please check your description and try again.";
        } else if (error.message.includes("HTTP error")) {
          errorMessage =
            "Network error occurred. Please check your connection and try again.";
        }
      }

      alert(errorMessage);
    } finally {
      setIsAiAssisting(false);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setShowAiAssistant(false);
    setAiPrompt("");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Program
          </h1>
          <p className="text-gray-600 mt-2">
            Create a cultural heritage training program to share with the
            community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Program Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter program title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Program Description <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAiAssistant(!showAiAssistant)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Writing Assistant
                  </button>
                </div>

                {/* Writing Assistant Panel */}
                {showAiAssistant && (
                  <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      ✍️ Description Writing Assistant
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Describe your program idea and we&apos;ll help you create a detailed description.
                    </p>
                    <div className="space-y-3">
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Example: This program teaches traditional batik tulis from Yogyakarta. Participants will learn classic patterns and natural dyeing techniques..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handleAiAssist}
                          disabled={isAiAssisting || !aiPrompt.trim()}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isAiAssisting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Generate Description
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAiAssistant(false)}
                          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <textarea
                  id="description"
                  placeholder="Describe your program in detail"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) =>
                    handleInputChange("categoryId", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.categoryId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select program category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.categoryId}
                  </p>
                )}
              </div>

              {/* Duration and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="duration"
                    placeholder="Example: 3 months, 12 weeks"
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange("duration", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.duration ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.duration}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    placeholder="Enter program location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Criteria */}
              <div>
                <label
                  htmlFor="criteria"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Participant Criteria <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="criteria"
                  placeholder="Describe the criteria or requirements to join the program"
                  rows={3}
                  value={formData.criteria}
                  onChange={(e) =>
                    handleInputChange("criteria", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.criteria ? "border-red-500" : "border-gray-300"
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
            <h2 className="text-xl font-semibold mb-4">Program Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.endDate ? "border-red-500" : "border-gray-300"
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
            <h2 className="text-xl font-semibold mb-4">Program Media</h2>
            <p className="text-gray-600 mb-4">
              Add images and videos for your program (optional)
            </p>
            <div className="space-y-6">
              {/* Program Image */}
              <div>
                <label
                  htmlFor="programImageUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Program Image URL
                </label>
                <input
                  type="url"
                  id="programImageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.programImageUrl}
                  onChange={(e) =>
                    handleInputChange("programImageUrl", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Video URL */}
              <div>
                <label
                  htmlFor="videoUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Program Video URL
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={(e) =>
                    handleInputChange("videoUrl", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Video Thumbnail */}
              <div>
                <label
                  htmlFor="videoThumbnailUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Video Thumbnail URL
                </label>
                <input
                  type="url"
                  id="videoThumbnailUrl"
                  placeholder="https://example.com/thumbnail.jpg"
                  value={formData.videoThumbnailUrl}
                  onChange={(e) =>
                    handleInputChange("videoThumbnailUrl", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Program Settings</h2>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isOpen"
                checked={formData.isOpen}
                onChange={(e) => handleInputChange("isOpen", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isOpen"
                className="text-sm font-medium text-gray-700"
              >
                Program open for registration
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2 ml-7">
              If disabled, participants cannot register for this program
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
                  Creating Program...
                </>
              ) : (
                "Create Program"
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
              onClick={() => router.push("/dashboard/artisan/programs")}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-white text-gray-700 px-6 py-3 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
