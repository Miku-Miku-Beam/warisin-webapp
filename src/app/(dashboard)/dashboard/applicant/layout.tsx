import Sidebar from "./components/Sidebar";

function ArtisanDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="flex h-screen  overflow-hidden ">
                <Sidebar />
                <div className="h-screen overflow-scroll w-full">
                    {children}
                </div>
            </div>
        </>
    );
}


export default ArtisanDashboardLayout;