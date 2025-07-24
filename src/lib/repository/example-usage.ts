// Example usage showing auto-completion benefits

import { artisanRepository } from './artisan.repository';

// Example: Get artisan by ID with full type safety and auto-completion
async function exampleArtisanUsage() {
    const artisanId = "some-artisan-id";
    
    // ✅ Auto-completion will show: ArtisanUser | null
    const artisan = await artisanRepository.getArtisanById(artisanId);
    
    if (artisan) {
        // ✅ Auto-completion available for all properties
        console.log(artisan.name);              // string | null
        console.log(artisan.email);             // string
        console.log(artisan.ArtisanProfile?.story); // string
        console.log(artisan.ArtisanPrograms.length); // number
        
        // ✅ Auto-completion for nested objects
        artisan.ArtisanPrograms.forEach(program => {
            console.log(program.title);          // string
            console.log(program.category.name);  // string
            console.log(program.applications);   // ApplicationWithApplicant[]
            
            program.applications.forEach(app => {
                console.log(app.applicant.name); // string | null
                console.log(app.status);         // string
            });
        });
    }
    
    // ✅ Auto-completion for dashboard data
    const dashboard = await artisanRepository.getArtisanDashboard(artisanId);
    console.log(dashboard.totalPrograms);       // number
    console.log(dashboard.approvalRate);        // number
    console.log(dashboard.mostPopularProgram?.title); // string | undefined
    
    // ✅ Auto-completion for performance metrics
    const performance = await artisanRepository.getArtisanPerformance(artisanId);
    console.log(performance.performanceScore);  // number
    console.log(performance.recommendations);   // string[]
    
    performance.programPerformance.forEach(metric => {
        console.log(metric.title);              // string
        console.log(metric.approvalRate);       // number
        console.log(metric.isPopular);          // boolean
    });
    
    // ✅ Auto-completion for programs
    const programs = await artisanRepository.getMyPrograms(artisanId);
    programs.forEach(program => {
        console.log(program.title);             // string
        console.log(program.isOpen);            // boolean
        console.log(program.artisan.name);      // string | null
    });
    
    // ✅ Auto-completion for applications
    const applications = await artisanRepository.getMyApplications(artisanId);
    applications.forEach(app => {
        console.log(app.applicant.name);        // string | null
        console.log(app.Program.title);         // string
        console.log(app.status);                // string
    });
}

// Example: Create program with type safety
async function exampleCreateProgram() {
    const artisanId = "some-artisan-id";
    
    // ✅ Auto-completion for required fields
    const programData = {
        title: "Traditional Batik Workshop",
        description: "Learn traditional batik making techniques",
        duration: "3 weeks",
        location: "Yogyakarta",
        criteria: "Basic art knowledge required",
        categoryId: "category-id",
        startDate: new Date("2024-08-01"),
        endDate: new Date("2024-08-21"),
        programImageUrl: "image-url",
        videoUrl: "video-url",
        isOpen: true
    };
    
    // ✅ Return type will be ProgramWithDetails with auto-completion
    const createdProgram = await artisanRepository.createProgram(artisanId, programData);
    console.log(createdProgram.title);          // string
    console.log(createdProgram.category.name);  // string
    console.log(createdProgram.applications);   // ApplicationWithApplicant[]
}

// Example: Profile management with type safety
async function exampleProfileManagement() {
    const userId = "user-id";
    
    // ✅ Auto-completion for profile data
    const profileData = {
        userId: userId,
        story: "My artisan journey...",
        expertise: "Traditional crafts",
        location: "Bali",
        imageUrl: "profile-image-url",
        works: ["work1.jpg", "work2.jpg"]
    };
    
    // ✅ Return type will be ArtisanProfileDetails
    const profile = await artisanRepository.createArtisanProfile(profileData);
    console.log(profile.story);                 // string
    console.log(profile.user?.name);            // string | null | undefined
    console.log(profile.works);                 // string[]
}

export { exampleArtisanUsage, exampleCreateProgram, exampleProfileManagement };

