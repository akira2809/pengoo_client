// src/app/(public)/product/[slug]/page.tsx
import { ProductData, ProductFeature } from '@/app/type/product';
import { productData, mainIntroData, featureSections } from '@/app/api/data/product';
import  ProductImageGallery  from '@/components/layouts/ProductDetail/ProductImageGallery';
import  ProductDetailsSection  from '@/components/layouts/ProductDetail/ProductDetailsSection';
import  ProductBanner  from '@/components/layouts/ProductDetail/component/ProductBanner';
import  ProductTabs  from '@/components/layouts/ProductDetail/component/ProductTabs';
import  GameOfDrunksFeatureSection  from '@/components/layouts/ProductDetail/component/GameOfDrunksFeatureSection';
import { BlogSection } from '@/components/common/BlogSection';

interface ProductPageProps {
  product: ProductData;
  mainIntro: {
    title: string;
    description: string;
  };
  featureSections: ProductFeature[];
}

export default function ProductDetailPage({ 
  product = productData,
  mainIntro = mainIntroData,
  featureSections: sections = featureSections
}: ProductPageProps) {
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 md:pr-8">
          <ProductImageGallery images={product.images} />
        </div>
        <div className="w-full md:w-1/2 md:pl-8">
          <ProductDetailsSection
            productName={product.name}
            originalPrice={product.originalPrice}
            discountedPrice={product.discountedPrice}
            description={product.description}
            features={product.features}
            warranty={product.warranty}
            shippingInfo={product.shippingInfo}
          />
        </div>
      </div>
      
      <ProductBanner />
      <ProductTabs />
      
      <GameOfDrunksFeatureSection
        mainIntro={mainIntro}
        sections={sections}
      />
      
      <BlogSection />
    </div>
  );
}