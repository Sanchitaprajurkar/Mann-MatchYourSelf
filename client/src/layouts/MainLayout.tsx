import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // 👈 ADD THIS

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="bg-[#F9F7F3] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
