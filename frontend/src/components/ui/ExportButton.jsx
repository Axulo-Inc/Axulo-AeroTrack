import React, { useState } from 'react';
import { Download, FileText, FileJson, FileSpreadsheet, ChevronDown } from 'lucide-react';
import Button from './Button';
import { useToast } from './Toast';
import { exportToCSV, exportToJSON, exportToExcel, formatFleetForExport, formatDefectsForExport } from '../../utils/exportUtils';

const ExportButton = ({ 
  data, 
  filename = 'export',
  format = 'csv',
  type = 'fleet',
  variant = 'dropdown',
  size = 'md',
  className = '',
  onExportStart,
  onExportComplete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const toast = useToast();

  const formatDataForExport = () => {
    switch (type) {
      case 'fleet':
        return formatFleetForExport(data);
      case 'defects':
        return formatDefectsForExport(data);
      default:
        return data;
    }
  };

  const handleExport = async (exportFormat) => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    setExporting(true);
    setIsOpen(false);
    
    if (onExportStart) onExportStart();

    try {
      const formattedData = formatDataForExport();
      const timestamp = new Date().toISOString().split('T')[0];
      const fullFilename = `${filename}_${timestamp}.${exportFormat === 'excel' ? 'xlsx' : exportFormat}`;

      let result;
      switch (exportFormat) {
        case 'csv':
          result = exportToCSV(formattedData, fullFilename);
          break;
        case 'json':
          result = exportToJSON(formattedData, fullFilename);
          break;
        case 'excel':
          result = await exportToExcel(formattedData, fullFilename);
          break;
        default:
          result = exportToCSV(formattedData, fullFilename);
      }

      if (result.success) {
        toast.success(`Data exported successfully as ${exportFormat.toUpperCase()}`);
        if (onExportComplete) onExportComplete(true);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Export failed: ${error.message}`);
      if (onExportComplete) onExportComplete(false);
    } finally {
      setExporting(false);
    }
  };

  // Simple button variant
  if (variant === 'button') {
    return (
      <Button
        variant="primary"
        size={size}
        onClick={() => handleExport(format)}
        isLoading={exporting}
        icon={Download}
        className={className}
      >
        Export {format.toUpperCase()}
      </Button>
    );
  }

  // Dropdown variant (default)
  return (
    <div className="relative">
      <Button
        variant="primary"
        size={size}
        onClick={() => setIsOpen(!isOpen)}
        icon={Download}
        iconPosition="right"
        icon2={ChevronDown}
        isLoading={exporting}
        className={className}
      >
        Export
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50 overflow-hidden">
            <button
              onClick={() => handleExport('csv')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-slate-700 transition"
            >
              <FileText size={16} className="text-green-400" />
              <span className="flex-1 text-left">CSV File</span>
            </button>
            
            <button
              onClick={() => handleExport('json')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-slate-700 transition border-t border-slate-700"
            >
              <FileJson size={16} className="text-yellow-400" />
              <span className="flex-1 text-left">JSON File</span>
            </button>
            
            <button
              onClick={() => handleExport('excel')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-slate-700 transition border-t border-slate-700"
            >
              <FileSpreadsheet size={16} className="text-green-600" />
              <span className="flex-1 text-left">Excel File</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Preset export buttons for common use cases
export const ExportFleetButton = ({ data, ...props }) => (
  <ExportButton 
    data={data} 
    type="fleet" 
    filename="axulo_fleet" 
    {...props} 
  />
);

export const ExportDefectsButton = ({ data, ...props }) => (
  <ExportButton 
    data={data} 
    type="defects" 
    filename="axulo_defects" 
    {...props} 
  />
);

export default ExportButton;
