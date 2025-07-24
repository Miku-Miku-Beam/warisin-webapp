// Repository exports
export { applicantRepository } from './applicant.repository';
export { applicationRepository } from './application.repository';
export { artisanRepository } from './artisan.repository';
export { categoryRepository } from './category.repository';
export { programsRepository } from './program.repository';
export { userRepository } from './user.repository';

// Interface exports
export type {
    IApplicantApplicationData, IApplicantRepository,
    ICreateApplicantProfileData,
    IUpdateApplicantProfileData
} from './applicant.repository';

export type {
    ApplicationWithProgram,
    ArtisanDashboard,
    ArtisanPerformance,
    ArtisanProfileDetails,
    IArtisanRepository,
    ICreateArtisanProfileData,
    IUpdateArtisanProfileData,
    ProgramPerformanceMetric,
    ProgramWithApplications
} from './artisan.repository';

export type {
    ICreateUserData,
    IUpdateUserData, IUserRepository
} from './user.repository';

export type {
    ICategoryRepository,
    ICreateCategoryData,
    IUpdateCategoryData
} from './category.repository';

export type {
    ApplicantApplicationStats, ApplicantProfile as ApplicationApplicantProfile,
    ApplicantUser as ApplicationApplicantUser, ArtisanUser as ApplicationArtisanUser,
    Category as ApplicationCategory, ProgramWithDetails as ApplicationProgramWithDetails,
    ApplicationStats, ApplicationWithDetails, ArtisanApplicationStats, IApplicationRepository,
    ICreateApplicationData,
    IUpdateApplicationData, ProgramApplicationStats
} from './application.repository';

export type {
    ApplicantProfile, ApplicantUser, ApplicationWithApplicant, ArtisanProfile, ArtisanStats, ArtisanUser, Category, ICreateProgramData,
    IProgramsRepository,
    IUpdateProgramData as ProgramUpdateData,
    ProgramWithDetails,
    ProgramWithStats, RecentApplication
} from './program.repository';

// Utility exports
export { applicantUtils } from './applicant.repository';
export { applicationUtils } from './application.repository';
export { artisanUtils } from './artisan.repository';
export { categoryUtils } from './category.repository';
export { userUtils } from './user.repository';

// Common utilities
export {
    analyticsUtils,
    utils as commonUtils, dateUtils, dbUtils, fileUtils, stringUtils, validationUtils
} from './utils';

// Import for internal use
import { applicantRepository, applicantUtils } from './applicant.repository';
import { applicationRepository, applicationUtils } from './application.repository';
import { artisanRepository, artisanUtils } from './artisan.repository';
import { categoryRepository, categoryUtils } from './category.repository';
import { artisanUtils as programArtisanUtils, programsRepository } from './program.repository';
import { userRepository, userUtils } from './user.repository';

// Combined repository for easier imports
export const repositories = {
    applicant: applicantRepository,
    artisan: artisanRepository,
    user: userRepository,
    category: categoryRepository,
    application: applicationRepository,
    program: programsRepository // Assuming program-related functions are in application repository
};

export const utils = {
    applicant: applicantUtils,
    artisan: artisanUtils,
    user: userUtils,
    category: categoryUtils,
    application: applicationUtils,
    programArtisan: programArtisanUtils
};
