import { HeroSection } from "../../components/HeroSection";
import { LoginCard } from "../../components/LoginCard";

const LoginPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-secondary px-[15%]">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 15% 85%, rgba(0,124,195,.10) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 10%, rgba(0,90,150,.08) 0%, transparent 55%)",
        }}
      />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[55%] h-[130%] w-px bg-linear-to-b from-transparent via-primary/18 to-transparent" />
        <div className="absolute top-[60%] left-[-5%] h-px w-[55%] bg-linear-to-r from-transparent via-primary/18 to-transparent" />
      </div>

      <div className="relative z-10 grid min-h-screen grid-cols-[1fr_480px]">
        <HeroSection />
        <LoginCard />
      </div>
    </div>
  );
};

export default LoginPage;
