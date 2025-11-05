import { HeroSection } from "@/sections/hero";
import { ProjectsSection } from "@/sections/projects";
import { AboutSection } from "@/sections/about";
import { ContactSection } from "@/sections/contact";
import Footer from "@/sections/footer";

export default function Home() {
  return (
    <main className="flex flex-col gap-24 pb-12">
      <HeroSection />
      <ProjectsSection />
      <Footer />
    </main>
  );
}
