import Hero from "@/components/main/home-page/hero";
import JoinAnggotaPage from "@/components/main/home-page/join-anggota";
import WhyJoinPesantrenSection from "@/components/main/home-page/why-join";
import PondokPesantrenOverview from "@/components/main/home-page/pondok-overview";
import ProdukPondokPesantrenSection from "@/components/main/home-page/produk-pesantren";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <PondokPesantrenOverview/>
      <ProdukPondokPesantrenSection/>
      <WhyJoinPesantrenSection />
      <div className="mt-10">
        <JoinAnggotaPage />
      </div>
    </div>
  );
}
