import Papa from 'papaparse';
import { saveAs } from 'file-saver';

// Export data as CSV
export const exportToCSV = (data, filename = 'export.csv') => {
  try {
    // Convert data to CSV
    const csv = Papa.unparse(data);
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
    
    return { success: true };
  } catch (error) {
    console.error('CSV Export failed:', error);
    return { success: false, error: error.message };
  }
};

// Export data as JSON
export const exportToJSON = (data, filename = 'export.json') => {
  try {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, filename);
    
    return { success: true };
  } catch (error) {
    console.error('JSON Export failed:', error);
    return { success: false, error: error.message };
  }
};

// Format fleet data for export
export const formatFleetForExport = (fleetData) => {
  return fleetData.map(aircraft => ({
    'Registration': aircraft.registration,
    'Aircraft Type': aircraft.type,
    'Status': aircraft.status,
    'Flight Hours': aircraft.hours,
    'Cycles': aircraft.cycles,
    'Last Maintenance': new Date(aircraft.lastMaintenance).toLocaleDateString(),
    'MTBF (hours)': calculateMTBF(aircraft),
    'Health Score': calculateHealthScore(aircraft)
  }));
};

// Format defects for export
export const formatDefectsForExport = (defects, aircraftMap = {}) => {
  return defects.map(defect => ({
    'Aircraft': aircraftMap[defect.aircraftId] || `Aircraft ${defect.aircraftId}`,
    'Description': defect.description,
    'Severity': defect.severity,
    'Status': defect.status,
    'Date Reported': defect.date || new Date().toLocaleDateString(),
    'Days Open': defect.status === 'Open' ? calculateDaysOpen(defect) : 'Closed'
  }));
};

// Helper functions
const calculateMTBF = (aircraft) => {
  // Simple MTBF calculation (mock)
  return Math.round(aircraft.hours / (aircraft.cycles / 100));
};

const calculateHealthScore = (aircraft) => {
  if (aircraft.status === 'Maintenance') return 'Critical';
  if (aircraft.hours > 20000) return 'Warning';
  return 'Good';
};

const calculateDaysOpen = (defect) => {
  if (!defect.date) return 'N/A';
  const days = Math.floor((new Date() - new Date(defect.date)) / (1000 * 60 * 60 * 24));
  return days;
};

// Export data as Excel (XLSX) - requires additional library
export const exportToExcel = async (data, filename = 'export.xlsx') => {
  try {
    // Dynamic import of xlsx library (only when needed)
    const XLSX = await import('xlsx');
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // Generate buffer and save
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, filename);
    
    return { success: true };
  } catch (error) {
    console.error('Excel Export failed:', error);
    return { success: false, error: error.message };
  }
};
