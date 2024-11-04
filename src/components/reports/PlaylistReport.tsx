import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Search, Calendar, Download, FileText } from 'lucide-react';
import { mockBranches, mockGroups, mockPlaylists } from './mockData';

interface FilterOptions {
  startDate: string;
  endDate: string;
  selectedBranches: string[];
  selectedGroups: string[];
  searchTerm: string;
}

const PlaylistReport: React.FC = () => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    startDate: '',
    endDate: '',
    selectedBranches: [],
    selectedGroups: [],
    searchTerm: ''
  });

  const [filteredPlaylists, setFilteredPlaylists] = useState(mockPlaylists);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilterOptions(prev => ({ ...prev, [key]: value }));
    applyFilters({ ...filterOptions, [key]: value });
  };

  const toggleBranchSelection = (branchId: string) => {
    const newSelection = filterOptions.selectedBranches.includes(branchId)
      ? filterOptions.selectedBranches.filter(id => id !== branchId)
      : [...filterOptions.selectedBranches, branchId];
    
    handleFilterChange('selectedBranches', newSelection);
  };

  const toggleGroupSelection = (groupId: string) => {
    const newSelection = filterOptions.selectedGroups.includes(groupId)
      ? filterOptions.selectedGroups.filter(id => id !== groupId)
      : [...filterOptions.selectedGroups, groupId];
    
    handleFilterChange('selectedGroups', newSelection);
  };

  const applyFilters = (filters: FilterOptions) => {
    let filtered = [...mockPlaylists];

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(playlist =>
        playlist.branch.name.toLowerCase().includes(searchLower) ||
        playlist.name.toLowerCase().includes(searchLower)
      );
    }

    if (filters.selectedBranches.length > 0) {
      filtered = filtered.filter(playlist => 
        filters.selectedBranches.includes(playlist.branch.branchId)
      );
    }

    if (filters.selectedGroups.length > 0) {
      filtered = filtered.filter(playlist => 
        playlist.branch.groupName && 
        filters.selectedGroups.includes(playlist.branch.groupName)
      );
    }

    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(playlist => {
        const assignedDate = new Date(playlist.assignedDate);
        return assignedDate >= new Date(filters.startDate) && 
               assignedDate <= new Date(filters.endDate);
      });
    }

    setFilteredPlaylists(filtered);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(64, 150, 254);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Cloud Media', 14, 25);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Playlist Report', 14, 35);

    let yPos = 60;
    if (filterOptions.startDate && filterOptions.endDate) {
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.text(`Report Period: ${filterOptions.startDate} to ${filterOptions.endDate}`, 14, 50);
    }

    filteredPlaylists.forEach((playlist, index) => {
      doc.setDrawColor(230, 230, 230);
      doc.line(14, yPos - 5, doc.internal.pageSize.width - 14, yPos - 5);

      doc.setFillColor(245, 247, 250);
      doc.rect(14, yPos, doc.internal.pageSize.width - 28, 25, 'F');
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Branch Information', 16, yPos + 8);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text([
        `Branch: ${playlist.branch.name} (${playlist.branch.branchId})`,
        `Group: ${playlist.branch.groupName || 'N/A'}`,
        `Devices: ${playlist.branch.deviceCount}`,
        `Category: ${playlist.category}`,
        `Created By: ${playlist.createdBy}`,
        `Assigned: ${playlist.assignedDate}`
      ], 16, yPos + 20);

      yPos += 50;

      const tableData = playlist.songs.map(song => [
        song.name,
        song.artist,
        song.duration,
        song.playCount.toString(),
        song.lastPlayed
      ]);

      (doc as any).autoTable({
        startY: yPos,
        head: [['Song Name', 'Artist', 'Duration', 'Play Count', 'Last Played']],
        body: tableData,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 5,
          overflow: 'linebreak',
          halign: 'left'
        },
        headStyles: {
          fillColor: [64, 150, 254],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 40 },
          2: { cellWidth: 20 },
          3: { cellWidth: 25 },
          4: { cellWidth: 35 }
        },
        margin: { left: 14, right: 14 }
      });

      yPos = (doc as any).lastAutoTable.finalY + 20;

      if (yPos > doc.internal.pageSize.height - 40 && index < filteredPlaylists.length - 1) {
        doc.addPage();
        yPos = 20;
      }
    });

    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setDrawColor(230, 230, 230);
      doc.line(14, doc.internal.pageSize.height - 20, doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 20);
      doc.text(
        `Generated by Cloud Media • ${new Date().toLocaleDateString()}`,
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 25,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save(`Cloud-Media-Playlist-Report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Playlist Report</h2>
          <p className="text-gray-600 mt-1">View and export playlist history</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToPDF}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={filterOptions.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={filterOptions.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by branch or playlist name..."
                value={filterOptions.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branches</label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {mockBranches.map(branch => (
                <label key={branch.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterOptions.selectedBranches.includes(branch.id)}
                    onChange={() => toggleBranchSelection(branch.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">{branch.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Groups</label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {mockGroups.map(group => (
                <label key={group.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterOptions.selectedGroups.includes(group.id)}
                    onChange={() => toggleGroupSelection(group.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">{group.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Playlist</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPlaylists.map((playlist) => (
              <tr key={playlist.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{playlist.branch.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{playlist.branch.groupName || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{playlist.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{playlist.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{playlist.createdBy}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{playlist.assignedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlaylistReport;