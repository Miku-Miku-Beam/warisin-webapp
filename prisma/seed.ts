import { PrismaClient } from '../generated';

// Define Role enum locally to match schema
enum Role {
    APPLICANT = 'Applicant',
    ARTISAN = 'ARTISAN'
}

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seeding...');

    // Clean existing data (in reverse order of dependencies)
    await prisma.application.deleteMany();
    await prisma.program.deleteMany();
    await prisma.herittageCategory.deleteMany();
    await prisma.artisanProfile.deleteMany();
    await prisma.applicantProfile.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Cleaned existing data');

    // Create Heritage Categories
    await prisma.herittageCategory.createMany({
        data: [
            { name: 'Batik' },
            { name: 'Keramik' },
            { name: 'Anyaman' },
            { name: 'Ukiran Kayu' },
            { name: 'Tenun' },
            { name: 'Perak' },
            { name: 'Wayang' },
            { name: 'Songket' },
        ],
    });

    console.log('📂 Created heritage categories');

    // Get created categories
    const createdCategories = await prisma.herittageCategory.findMany();

    // Create Users (Artisans)
    const artisan1 = await prisma.user.create({
        data: {
            email: 'pak.bambang@gmail.com',
            name: 'Pak Bambang Sutrisno',
            role: Role.ARTISAN,
            bio: 'Master craftsman with 30+ years experience in traditional batik making from Yogyakarta',
            profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            location: 'Yogyakarta',
            authId: 'firebase_artisan_bambang_001',
        },
    });

    const artisan2 = await prisma.user.create({
        data: {
            email: 'bu.sri@gmail.com',
            name: 'Bu Sri Handayani',
            role: Role.ARTISAN,
            bio: 'Traditional ceramic artist specializing in Majapahit-style pottery',
            profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b1d3?w=150',
            location: 'Solo',
            authId: 'firebase_artisan_sri_002',
        },
    });

    const artisan3 = await prisma.user.create({
        data: {
            email: 'pak.ahmad@gmail.com',
            name: 'Pak Ahmad Wijaya',
            role: Role.ARTISAN,
            bio: 'Wood carving master from Jepara with expertise in traditional Javanese motifs',
            profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            location: 'Jepara',
            authId: 'firebase_artisan_ahmad_003',
        },
    });

    const artisan4 = await prisma.user.create({
        data: {
            email: 'bu.sari@gmail.com',
            name: 'Bu Sari Indrawati',
            role: Role.ARTISAN,
            bio: 'Expert weaver specializing in traditional Tenun and Songket',
            profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
            location: 'Palembang',
            authId: 'firebase_artisan_sari_004',
        },
    });

    console.log('👨‍🎨 Created artisan users');

    // Create Users (Applicants)
    const applicant1 = await prisma.user.create({
        data: {
            email: 'andi.pratama@gmail.com',
            name: 'Andi Pratama',
            role: Role.APPLICANT,
            bio: 'Art student passionate about preserving Indonesian heritage',
            profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
            location: 'Jakarta',
            authId: 'firebase_applicant_andi_001',
        },
    });

    const applicant2 = await prisma.user.create({
        data: {
            email: 'sari.dewi@gmail.com',
            name: 'Sari Dewi',
            role: Role.APPLICANT,
            bio: 'Designer interested in traditional crafts and modern applications',
            profileImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
            location: 'Bandung',
            authId: 'firebase_applicant_sari_002',
        },
    });

    const applicant3 = await prisma.user.create({
        data: {
            email: 'budi.setiawan@gmail.com',
            name: 'Budi Setiawan',
            role: Role.APPLICANT,
            bio: 'Cultural enthusiast and amateur photographer',
            profileImageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150',
            location: 'Surabaya',
            authId: 'firebase_APPLICANT_budi_003',
        },
    });

    const applicant4 = await prisma.user.create({
        data: {
            email: 'maya.sari@gmail.com',
            name: 'Maya Sari',
            role: Role.APPLICANT,
            bio: 'University student studying Cultural Heritage and Arts',
            profileImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
            location: 'Yogyakarta',
            authId: 'firebase_applicant_maya_004',
        },
    });

    console.log('👨‍🎓 Created applicant users');

    // Create Artisan Profiles
    await prisma.artisanProfile.create({
        data: {
            userId: artisan1.id,
            story: 'Born into a family of batik makers in Yogyakarta, I learned the art from my grandmother. I have dedicated my life to preserving the traditional techniques of batik while also exploring contemporary designs. My workshop has been passed down for three generations.',
            expertise: 'Traditional Batik, Natural Dye Making, Contemporary Batik Design, Tulis Technique',
            location: 'Taman Sari, Yogyakarta',
            imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400',
            works: [
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
                'https://images.unsplash.com/photo-1594736797933-d0a9ba97a089?w=300',
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300'
            ],
        },
    });

    await prisma.artisanProfile.create({
        data: {
            userId: artisan2.id,
            story: 'I discovered my passion for ceramics during college and have since spent 25 years perfecting the traditional techniques of Majapahit pottery. My work bridges ancient wisdom with modern functionality, creating pieces that honor our ancestors while serving contemporary needs.',
            expertise: 'Traditional Pottery, Majapahit Ceramics, Glazing Techniques, Terra Cotta',
            location: 'Kauman, Solo',
            imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
            works: [
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
                'https://images.unsplash.com/photo-1594736797933-d0a9ba97a089?w=300',
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300'
            ],
        },
    });

    await prisma.artisanProfile.create({
        data: {
            userId: artisan3.id,
            story: 'Coming from Jepara, the city of wood carving, I have been surrounded by this art form since childhood. I specialize in traditional Javanese motifs and have trained many apprentices over the years. Each piece tells a story of our rich cultural heritage.',
            expertise: 'Wood Carving, Traditional Javanese Motifs, Furniture Making, Relief Carving',
            location: 'Jepara Kota, Jepara',
            imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400',
            works: [
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
                'https://images.unsplash.com/photo-1594736797933-d0a9ba97a089?w=300',
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300'
            ],
        },
    });

    await prisma.artisanProfile.create({
        data: {
            userId: artisan4.id,
            story: 'Growing up in Palembang, I was fascinated by the intricate patterns of traditional Songket weaving. I learned from master weavers and now dedicate my life to teaching this almost-lost art to the younger generation, ensuring its preservation for the future.',
            expertise: 'Songket Weaving, Traditional Tenun, Gold Thread Work, Pattern Design',
            location: 'Ilir Barat, Palembang',
            imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0a9ba97a089?w=400',
            works: [
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
                'https://images.unsplash.com/photo-1594736797933-d0a9ba97a089?w=300',
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300'
            ],
        },
    });

    console.log('🏺 Created artisan profiles');

    // Create Applicant Profiles
    await prisma.applicantProfile.create({
        data: {
            userId: applicant1.id,
            background: 'Currently studying Fine Arts at University of Indonesia. I have always been fascinated by traditional Indonesian crafts and want to learn directly from master artisans to preserve these beautiful traditions.',
            interests: 'Traditional Arts, Cultural Preservation, Art History, Batik Making, Photography',
            portfolioUrl: 'https://portfolio.andi-pratama.com',
        },
    });

    await prisma.applicantProfile.create({
        data: {
            userId: applicant2.id,
            background: 'Graphic designer with 5 years of experience in the creative industry. I want to incorporate traditional motifs and techniques into modern design work and help preserve these arts for future generations through contemporary applications.',
            interests: 'Design, Traditional Motifs, Textile Arts, Cultural Heritage, Modern Applications',
            portfolioUrl: 'https://behance.net/sari-dewi',
        },
    });

    await prisma.applicantProfile.create({
        data: {
            userId: applicant3.id,
            background: 'Photography hobbyist and cultural enthusiast. I document traditional crafts and want to learn hands-on to better understand and capture the essence of these arts for my photography projects.',
            interests: 'Photography, Cultural Documentation, Traditional Crafts, Storytelling, Visual Arts',
            portfolioUrl: 'https://instagram.com/budi.setiawan.photo',
        },
    });

    await prisma.applicantProfile.create({
        data: {
            userId: applicant4.id,
            background: 'Third-year student at Gadjah Mada University majoring in Cultural Studies. I am passionate about Indonesian heritage and want to contribute to its preservation through hands-on learning and academic research.',
            interests: 'Cultural Studies, Heritage Preservation, Traditional Arts, Academic Research, Community Engagement',
            portfolioUrl: 'https://maya-sari-research.academia.edu',
        },
    });

    console.log('👥 Created applicant profiles');

    // Create Programs
    const batikCategory = createdCategories.find((c: any) => c.name === 'Batik');
    const ceramicCategory = createdCategories.find((c: any) => c.name === 'Keramik');
    const carvingCategory = createdCategories.find((c: any) => c.name === 'Ukiran Kayu');
    const tenunCategory = createdCategories.find((c: any) => c.name === 'Tenun');

    const program1 = await prisma.program.create({
        data: {
            title: 'Traditional Batik Making Intensive',
            description: 'Learn the complete process of traditional batik making from designing patterns to applying wax and natural dyes. This intensive program covers both theory and hands-on practice with traditional tools and techniques. Students will create their own batik pieces and learn about the cultural significance of different motifs.',
            duration: '3 months',
            criteria: 'Basic art background preferred, commitment to complete the full program, respect for traditional methods and cultural significance, willingness to work with natural materials',
            categoryId: batikCategory!.id,
            artisanId: artisan1.id,
            isOpen: true,
        },
    });

    const program2 = await prisma.program.create({
        data: {
            title: 'Majapahit Pottery Workshop',
            description: 'Discover the ancient art of Majapahit pottery. Learn traditional shaping techniques, natural glazing methods, and the cultural stories behind each piece. Perfect for beginners and intermediate ceramicists who want to connect with Indonesian ceramic heritage.',
            duration: '2 months',
            criteria: 'Interest in ceramics, willingness to work with clay daily, appreciation for Indonesian cultural heritage, physical ability to work at pottery wheel',
            categoryId: ceramicCategory!.id,
            artisanId: artisan2.id,
            isOpen: true,
        },
    });

    const program3 = await prisma.program.create({
        data: {
            title: 'Javanese Wood Carving Mastery',
            description: 'Master the intricate art of Javanese wood carving. Learn to carve traditional motifs, understand the spiritual significance of patterns, and create functional art pieces using time-honored techniques passed down through generations.',
            duration: '4 months',
            criteria: 'Basic woodworking knowledge helpful, physical ability to work with carving tools, patience for detailed work, respect for traditional methods',
            categoryId: carvingCategory!.id,
            artisanId: artisan3.id,
            isOpen: true,
        },
    });

    const program4 = await prisma.program.create({
        data: {
            title: 'Songket Weaving Traditional Course',
            description: 'Learn the royal art of Songket weaving with gold and silver threads. This comprehensive course covers the entire process from thread preparation to complex pattern creation. Understand the cultural significance and master this prestigious craft.',
            duration: '5 months',
            criteria: 'Patience for detailed work, good eyesight for fine thread work, cultural appreciation, commitment to complete intensive program',
            categoryId: tenunCategory!.id,
            artisanId: artisan4.id,
            isOpen: true,
        },
    });

    const program5 = await prisma.program.create({
        data: {
            title: 'Advanced Batik Techniques',
            description: 'For those who have basic batik knowledge, this advanced course focuses on complex techniques like canting, cap stamping, and combination methods. Learn to create masterpiece-level batik with intricate details.',
            duration: '2 months',
            criteria: 'Previous batik experience required, intermediate to advanced skill level, portfolio of previous work',
            categoryId: batikCategory!.id,
            artisanId: artisan1.id,
            isOpen: false,
        },
    });

    console.log('📚 Created programs');

    // Create Applications
    await prisma.application.create({
        data: {
            message: 'Dear Pak Bambang, I am deeply passionate about preserving Indonesian cultural heritage through art. Batik has always fascinated me, and I would love to learn from a master craftsman like yourself. I believe this opportunity will help me contribute to keeping this beautiful art form alive.',
            ProgramId: program1.id,
            applicantId: applicant1.id,
            status: 'PENDING',
            motivation: 'As an art student, I want to deepen my understanding of traditional Indonesian techniques and contribute to keeping this beautiful art form alive for future generations. I am particularly interested in the spiritual and cultural aspects of batik making.',
            cvUrl: 'https://drive.google.com/cv-andi-pratama',
        },
    });

    await prisma.application.create({
        data: {
            message: 'Hello Bu Sri, I am a graphic designer who wants to incorporate traditional motifs into modern work. Learning pottery would give me a deeper understanding of traditional Indonesian art forms and help me create more authentic designs.',
            ProgramId: program2.id,
            applicantId: applicant2.id,
            status: 'APPROVED',
            motivation: 'I believe that understanding traditional crafts will make me a better designer and help me create work that honors our cultural heritage while remaining relevant in modern contexts.',
            cvUrl: 'https://drive.google.com/cv-sari-dewi',
        },
    });

    await prisma.application.create({
        data: {
            message: 'Dear Pak Ahmad, as someone who documents traditional crafts through photography, I want to experience the creation process firsthand to better capture and share these stories with a wider audience.',
            ProgramId: program3.id,
            applicantId: applicant3.id,
            status: 'PENDING',
            motivation: 'Learning wood carving will allow me to tell more authentic stories about Indonesian craftsmanship and inspire others to appreciate our heritage through my photography and documentation work.',
            cvUrl: 'https://drive.google.com/cv-budi-setiawan',
        },
    });

    await prisma.application.create({
        data: {
            message: 'Bu Sari, I am a Cultural Studies student fascinated by the royal tradition of Songket weaving. I would be honored to learn this prestigious craft and contribute to its preservation through academic research.',
            ProgramId: program4.id,
            applicantId: applicant4.id,
            status: 'APPROVED',
            motivation: 'My academic background in Cultural Studies combined with hands-on learning will help me contribute to both the practical preservation and scholarly documentation of this important tradition.',
            cvUrl: 'https://drive.google.com/cv-maya-sari',
        },
    });

    await prisma.application.create({
        data: {
            message: 'Pak Bambang, I have been following your work for years and would be honored to learn batik making under your guidance. This is a dream opportunity for me to learn from the best.',
            ProgramId: program1.id,
            applicantId: applicant1.id,
            status: 'REJECTED',
            motivation: 'Batik represents the soul of Indonesian art, and I want to be part of preserving this tradition while exploring its contemporary applications in my design work.',
            cvUrl: 'https://drive.google.com/cv-sari-dewi-2',
        },
    });

    await prisma.application.create({
        data: {
            message: 'Dear Bu Sri, I am particularly interested in the spiritual and meditative aspects of pottery making. I believe this craft can help me grow both artistically and personally.',
            ProgramId: program2.id,
            applicantId: applicant4.id,
            status: 'PENDING',
            motivation: 'As a student of cultural studies, I want to understand the deeper meaning behind traditional pottery techniques and how they reflect Indonesian philosophy and way of life.',
            cvUrl: 'https://drive.google.com/cv-maya-sari-pottery',
        },
    });

    console.log('📝 Created applications');

    console.log('✅ Seeding completed successfully!');

    // Print summary
    const userCount = await prisma.user.count();
    const programCount = await prisma.program.count();
    const applicationCount = await prisma.application.count();
    const categoryCount = await prisma.herittageCategory.count();

    console.log(`
📊 Summary:
- Users: ${userCount} (${await prisma.user.count({ where: { role: 'ARTISAN' } })} artisans, ${await prisma.user.count({ where: { role: Role.APPLICANT } })} APPLICANTs)
- Heritage Categories: ${categoryCount}
- Programs: ${programCount} (${await prisma.program.count({ where: { isOpen: true } })} open, ${await prisma.program.count({ where: { isOpen: false } })} closed)
- Applications: ${applicationCount}
- Artisan Profiles: ${await prisma.artisanProfile.count()}
- APPLICANT Profiles: ${await prisma.applicantProfile.count()}
  `);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
