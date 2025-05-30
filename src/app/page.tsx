"use client"; // Đảm bảo dòng này ở đầu file

import React from 'react';
import Banner from '@/components/common/Banner/Banner';
import FeaturedProducts from '@/components/features/Product/FeaturedProducts'; 
import BannerHotspot from '@/components/common/Banner/Banner-hotspot';  
import CollectionSection from '@/components/common/collection/CollectionSection';
import BenefitsSection from '@/components/common/BenefitsSection/BenefitsSection';
import HeadlineMarquee from '@/components/common/HeadlineMarquee';
import { SmoothScrollHero } from '@/components/common/HeroScrollZoom';
import { AboutMaztermindSection } from '@/components/common/AboutMaztermindSection';
import { VideoSection } from '@/components/common/VideoSection';
import { TestimonialCarousel } from '@/components/common/TestimonialCarousel';
import { BlogSection } from '@/components/common/BlogSection';

function HomePage() {
  
  return (
    <>
      <Banner />
     <FeaturedProducts />
     <BannerHotspot />
     <CollectionSection />
     <BenefitsSection />
     <HeadlineMarquee />
     <SmoothScrollHero />
     <AboutMaztermindSection/>
     <VideoSection/>
     <TestimonialCarousel/>
     <BlogSection/>
    </>
  )
}

export default HomePage;