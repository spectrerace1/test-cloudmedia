import React from 'react';
import ContentLoader from 'react-content-loader';

const MediaLibraryLoader: React.FC = () => {
  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Featured Section Loader */}
      <ContentLoader 
        speed={2}
        width={1600}
        height={200}
        viewBox="0 0 1600 200"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="0" rx="16" ry="16" width="1600" height="200" />
      </ContentLoader>

      {/* Section Headers and Grid Loader */}
      {[0, 1, 2].map((section) => (
        <div key={section} className="space-y-4">
          <ContentLoader 
            speed={2}
            width={300}
            height={60}
            viewBox="0 0 300 60"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="4" ry="4" width="200" height="24" />
            <rect x="0" y="32" rx="4" ry="4" width="140" height="16" />
          </ContentLoader>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <ContentLoader 
                key={index}
                speed={2}
                width={200}
                height={280}
                viewBox="0 0 200 280"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <rect x="0" y="0" rx="8" ry="8" width="200" height="200" />
                <rect x="0" y="220" rx="4" ry="4" width="160" height="20" />
                <rect x="0" y="250" rx="4" ry="4" width="120" height="16" />
              </ContentLoader>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaLibraryLoader;