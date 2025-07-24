import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

const getProgramsData = async () => {
    const cookieStore = await cookies();

    const artisanId = cookieStore.get('artisanId')?.value;

    if (!artisanId) {
        console.error('Artisan ID not found in cookies');
        return [];
    }

    await prisma.program.findMany({
        where: {
            artisanId: artisanId
        },
    })
}



// export default function ArtisanProgramPage() {
//     const programs = await getProgramsData();

//     return (
//         <div>
//             <h1>Artisan Programs</h1>
//             <ul>
//                 {programs.map((program) => (
//                     <li key={program.id}>{program.name}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// }