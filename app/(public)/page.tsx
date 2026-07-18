import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { PopularCategories } from "@/components/sections/PopularCategories";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { TrainingCategories } from "@/components/sections/TrainingCategories";
import { TrainingProcess } from "@/components/sections/TrainingProcess";
import { GalleryTestimonials } from "@/components/sections/GalleryTestimonials";
import { FaqCta } from "@/components/sections/FaqCta";
import { HomeContact } from "@/components/sections/HomeContact";
import { getSettings } from "@/lib/site";

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <>
      <Hero />
      <TrustBar />
      <PopularCategories />
      <WhyChooseUs />
      <TrainingCategories />
      <TrainingProcess />
      <GalleryTestimonials />
      <FaqCta />
      <HomeContact settings={settings} />
    </>
  );
}
