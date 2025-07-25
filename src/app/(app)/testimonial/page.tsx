// // src/app/(app)/Testimonial/page.tsx
// import prisma from "@/lib/prisma";
// import StoryForm from "./StoryForm";
// import StoryList from "./StoryList";

// export default async function TestimonialPage() {
//   // SSR: Ambil data cerita dari database
//   const stories = await prisma.story.findMany({
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       title: true,
//       story: true,
//       userName: true,
//       createdAt: true,
//     },
//   });

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white py-12">
//       <StoryForm />
//       <StoryList stories={stories} />
//     </main>
//   );
// }


const TestimonialPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Testimonial</h1>
        <p className="text-center text-gray-600 mb-4">Coming soon...</p>
      </div>
    </main>
  );
}

export default TestimonialPage;