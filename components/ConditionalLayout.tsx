
// "use client";

// import { usePathname } from "next/navigation";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// export default function ConditionalLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     const pathname = usePathname();
//     const isCalendarPage = pathname === "/calendar";

//     return (
//         <>
//             {!isCalendarPage && <Navbar />}
//             <div className="flex-1">{children}</div>
//             {!isCalendarPage && <Footer />}
//         </>
//     );
// }
