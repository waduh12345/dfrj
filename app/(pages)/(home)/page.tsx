import Hero from "@/components/main/home-page/hero";
import JoinAnggotaPage from "@/components/main/home-page/join-anggota";
import ProdukKoperasiSection from "@/components/main/home-page/produk-koperasi";
import ProfileSectionWithCarousel from "@/components/main/home-page/profile-section-corousel";
import WhyJoinSection from "@/components/main/home-page/why-join";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <ProfileSectionWithCarousel />
      <ProdukKoperasiSection />
      <WhyJoinSection />
      <div className="mt-10">
        <JoinAnggotaPage />
      </div>
    </div>
  );
}
