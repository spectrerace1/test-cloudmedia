import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterSectionProps {
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filterOptions,
  setFilterOptions,
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search playlists, branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <input
              type="date"
              value={filterOptions.startDate}
              onChange={(e) => setFilterOptions({ ...filterOptions, startDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center">
            <span className="text-gray-500">to</span>
          </div>
          <div>
            <input
              type="date"
              value={filterOptions.endDate}
              onChange={(e) => setFilterOptions({ ...filterOptions, endDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;