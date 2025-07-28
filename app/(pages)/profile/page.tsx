import SectionBupati from "@/components/main/profile-page/bupati-section";
import ProfileDesa from "@/components/main/profile-page/profile-desa";
import ProgramSection from "@/components/main/profile-page/program-section";
import ValueVillage from "@/components/main/profile-page/value-village";


export default function Profile() {
  return (
    <div className="min-h-screen">
      <ProfileDesa/>
      <SectionBupati/>
      <ValueVillage/>
      <ProgramSection/>
    </div>
  );
}