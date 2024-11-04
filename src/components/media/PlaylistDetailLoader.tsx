import React from 'react';
import ContentLoader from 'react-content-loader';

const PlaylistDetailLoader: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Section Loader */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <ContentLoader 
          speed={2}
          width={120}
          height={24}
          viewBox="0 0 120 24"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          className="mb-6"
        >
          <rect x="24" y="4" rx="3" ry="3" width="96" height="16" />
        </ContentLoader>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Artwork Loader */}
            <ContentLoader 
              speed={2}
              width={128}
              height={128}
              viewBox="0 0 128 128"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              <rect x="0" y="0" rx="8" ry="8" width="128" height="128" />
            </ContentLoader>

            {/* Title and Info Loader */}
            <div className="space-y-4">
              <ContentLoader 
                speed={2}
                width={300}
                height={80}
                viewBox="0 0 300 80"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <rect x="0" y="0" rx="4" ry="4" width="240" height="32" />
                <rect x="0" y="44" rx="3" ry="3" width="180" height="16" />
                <rect x="192" y="44" rx="3" ry="3" width="80" height="16" />
              </ContentLoader>
            </div>
          </div>

          {/* Push Button Loader */}
          <ContentLoader 
            speed={2}
            width={80}
            height={40}
            viewBox="0 0 80 40"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="8" ry="8" width="80" height="40" />
          </ContentLoader>
        </div>
      </div>

      {/* Songs List Loader */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <ContentLoader 
          speed={2}
          width={1200}
          height={600}
          viewBox="0 0 1200 600"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          {/* Table Header */}
          <rect x="24" y="24" rx="3" ry="3" width="40" height="16" />
          <rect x="120" y="24" rx="3" ry="3" width="200" height="16" />
          <rect x="376" y="24" rx="3" ry="3" width="160" height="16" />
          <rect x="592" y="24" rx="3" ry="3" width="80" height="16" />

          {/* Table Rows */}
          {[...Array(10)].map((_, index) => (
            <React.Fragment key={index}>
              <rect 
                x="24" 
                y={80 + (index * 56)} 
                rx="3" 
                ry="3" 
                width="24" 
                height="16" 
              />
              <rect 
                x="120" 
                y={80 + (index * 56)} 
                rx="3" 
                ry="3" 
                width="180" 
                height="16" 
              />
              <rect 
                x="376" 
                y={80 + (index * 56)} 
                rx="3" 
                ry="3" 
                width="140" 
                height="16" 
              />
              <rect 
                x="592" 
                y={80 + (index * 56)} 
                rx="3" 
                ry="3" 
                width="60" 
                height="16" 
              />
            </React.Fragment>
          ))}
        </ContentLoader>
      </div>
    </div>
  );
};

export default PlaylistDetailLoader;