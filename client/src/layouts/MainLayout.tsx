import { ReactNode, Suspense, lazy } from "react";

const Navbar = lazy(() => import("../components/Navbar"));
const Footer = lazy(() => import("../components/Footer"));

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="bg-[#F9F7F3] min-h-screen flex flex-col">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      <main className="flex-1">
        {children}
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default MainLayout;
