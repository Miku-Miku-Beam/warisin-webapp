import Sidebar from "./components/Sidebar";

function ArtisanDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                {children}
            </div>
        </>
    );
}


export default ArtisanDashboardLayout;