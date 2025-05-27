// components/Header/CollectionsDropdown.tsx
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface Collection {
  id: number;
  name: string;
  description: string;
  image: string;
  itemCount: number;
}

interface CollectionsDropdownProps {
  collections: Collection[];
  collectionsOpen: boolean;
  onClose: () => void;
}

export default function CollectionsDropdown({
  collections,
  collectionsOpen,
  onClose,
}: CollectionsDropdownProps) {
  const collectionsMenuRef = useRef<HTMLDivElement>(null);
  const collectionsItemsRef = useRef<HTMLDivElement>(null);

  // Animation logic (di chuyển từ Header.tsx)
  useEffect(() => {
    if (collectionsOpen) {
      gsap.set(collectionsMenuRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transformOrigin: "top center",
        display: "block"
      });
      gsap.set(collectionsItemsRef.current?.children || [], {
        opacity: 0,
        y: 20
      });

      gsap.to(collectionsMenuRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(collectionsItemsRef.current?.children || [], {
        opacity: 1,
        y: 0,
        duration: 0.2,
        stagger: 0.05,
        delay: 0.1,
        ease: "power2.out"
      });
    } else {
      gsap.to(collectionsItemsRef.current?.children || [], {
        opacity: 0,
        y: 20,
        duration: 0.15,
        stagger: 0.03,
        ease: "power2.in"
      });
      gsap.to(collectionsMenuRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        duration: 0.2,
        delay: 0.05,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(collectionsMenuRef.current, { display: "none" });
        }
      });
    }
  }, [collectionsOpen]);

  return (
    <>
      <div
        ref={collectionsMenuRef}
        // Đã thay đổi z-index thành z-[9999] để đảm bảo nó hiển thị trên mọi thứ.
        // Bạn có thể dùng z-50 nếu muốn tuân thủ Tailwind mặc định và z-index đó đủ cao.
        // XÓA onMouseLeave TẠI ĐÂY - nó sẽ được xử lý ở component cha hoặc bởi overlay
        className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t z-[9999]"
        style={{ display: collectionsOpen ? "block" : "none" }}
      >
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Our Collections</h3>
            <a href="#" className="text-sm text-primary hover:underline font-semibold">
              View All Collections →
            </a>
          </div>

          <div ref={collectionsItemsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <a
                key={collection.id}
                href="#"
                className="group flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-20 h-15 object-cover rounded-lg group-hover:scale-105 transition-transform"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                    {collection.name}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {collection.description}
                  </p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    {collection.itemCount} items
                  </span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </a>
            ))}
          </div>

          {/* Featured Section */}
          <div className="mt-8 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-primary to-accent text-white p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-2">New Arrivals</h4>
                <p className="text-sm opacity-90 mb-3">Fresh styles just landed</p>
                <button className="text-sm font-semibold underline hover:no-underline">
                  Shop Now
                </button>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-2 text-gray-800">Sale Items</h4>
                <p className="text-sm text-gray-600 mb-3">Up to 50% off selected items</p>
                <button className="text-sm font-semibold text-primary hover:underline">
                  View Sale
                </button>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-2 text-gray-800">Style Guide</h4>
                <p className="text-sm text-gray-600 mb-3">Latest fashion tips & trends</p>
                <button className="text-sm font-semibold text-primary hover:underline">
                  Read More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Collections Overlay */}
      {collectionsOpen && (
        <div
          // Đặt z-index thấp hơn dropdown nhưng cao hơn các phần tử khác.
          // Đã thay đổi z-20 thành z-40 để đảm bảo nó nằm dưới dropdown (z-[9999])
          className="fixed inset-0 bg-black bg-opacity-10 z-40"
          onClick={onClose}
        />
      )}
    </>
  );
}