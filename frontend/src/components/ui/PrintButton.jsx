import { useState, useRef } from 'react'
import { Printer, Download, Calendar, Filter, X } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import Button from './Button'
import Card from './Card'
import Input from './Input'
import Select from './Select'
import { useToast } from './Toast'
import { useTheme } from '../../contexts/ThemeContext'

// Report Template Component
const ReportTemplate = ({ 
  data, 
  title, 
  dateRange,
  filters,
  summary,
  columns,
  type = 'fleet' 
}) => {
  const { isDark } = useTheme()
  
  // Print-specific styles (will be applied only when printing)
  const printStyles = `
    @media print {
      body { background: white; }
      .print-container { 
        background: white; 
        color: black;
        padding: 20px;
        font-family: Arial, sans-serif;
      }
      .print-header { 
        border-bottom: 2px solid #2563eb;
        padding-bottom: 15px;
        margin-bottom: 20px;
      }
      .print-title { 
        font-size: 24px;
        font-weight: bold;
        color: #1e293b;
      }
      .print-meta {
        color: #64748b;
        font-size: 12px;
        margin-top: 5px;
      }
      .print-summary {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        margin-bottom: 30px;
      }
      .print-summary-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 15px;
      }
      .print-summary-label {
        color: #64748b;
        font-size: 12px;
        margin-bottom: 5px;
      }
      .print-summary-value {
        color: #0f172a;
        font-size: 20px;
        font-weight: bold;
      }
      .print-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      .print-table th {
        background: #f1f5f9;
        color: #1e293b;
        font-weight: 600;
        padding: 10px;
        text-align: left;
        border-bottom: 2px solid #2563eb;
      }
      .print-table td {
        padding: 8px 10px;
        border-bottom: 1px solid #e2e8f0;
        color: #334155;
      }
      .print-table tr:last-child td {
        border-bottom: none;
      }
      .print-footer {
        margin-top: 30px;
        padding-top: 15px;
        border-top: 1px solid #e2e8f0;
        text-align: center;
        color: #94a3b8;
        font-size: 11px;
      }
      .print-badge {
        display: inline-block;
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
      }
      .badge-success { background: #dcfce7; color: #166534; }
      .badge-warning { background: #fef9c3; color: #854d0e; }
      .badge-danger { background: #fee2e2; color: #991b1b; }
      .no-print { display: none; }
    }
  `

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'badge-success'
      case 'maintenance': return 'badge-warning'
      case 'critical': return 'badge-danger'
      default: return ''
    }
  }

  return (
    <>
      <style>{printStyles}</style>
      <div className="print-container">
        {/* Header */}
        <div className="print-header">
          <h1 className="print-title">Axulo AeroTrack - {title}</h1>
          <div className="print-meta">
            <div>Generated: {new Date().toLocaleString()}</div>
            {dateRange && <div>Period: {dateRange}</div>}
          </div>
        </div>

        {/* Filters Applied */}
        {filters && Object.keys(filters).length > 0 && (
          <div style={{ marginBottom: '20px', fontSize: '12px', color: '#64748b' }}>
            <strong>Filters Applied:</strong> {Object.entries(filters)
              .map(([key, value]) => `${key}: ${value}`)
              .join(' • ')}
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="print-summary">
            {summary.map((item, index) => (
              <div key={index} className="print-summary-card">
                <div className="print-summary-label">{item.label}</div>
                <div className="print-summary-value">{item.value}</div>
                {item.subtext && (
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '5px' }}>
                    {item.subtext}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Data Table */}
        <table className="print-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => {
                  const value = row[col.toLowerCase()]
                  
                  // Handle status badges
                  if (col === 'Status' && value) {
                    return (
                      <td key={colIdx}>
                        <span className={`print-badge ${getStatusBadgeClass(value)}`}>
                          {value}
                        </span>
                      </td>
                    )
                  }
                  
                  // Handle dates
                  if (col.includes('Date') && value) {
                    return (
                      <td key={colIdx}>
                        {new Date(value).toLocaleDateString()}
                      </td>
                    )
                  }
                  
                  // Handle numbers
                  if (typeof value === 'number') {
                    return (
                      <td key={colIdx}>
                        {value.toLocaleString()}
                      </td>
                    )
                  }
                  
                  return <td key={colIdx}>{value || '-'}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Row */}
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#334155' }}>
          <strong>Total Records:</strong> {data.length}
        </div>

        {/* Footer */}
        <div className="print-footer">
          <div>Axulo AeroTrack - Aviation Maintenance & Reliability Analytics</div>
          <div style={{ marginTop: '5px' }}>Confidential - For Internal Use Only</div>
        </div>
      </div>
    </>
  )
}

const PrintButton = ({
  data = [],
  title = 'Fleet Report',
  columns = [],
  summary = [],
  filters = {},
  dateRange,
  type = 'fleet',
  variant = 'dropdown',
  size = 'md',
  className = '',
  onPrintStart,
  onPrintComplete
}) => {
  const [showOptions, setShowOptions] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [reportTitle, setReportTitle] = useState(title)
  const [includeSummary, setIncludeSummary] = useState(true)
  const [includeFilters, setIncludeFilters] = useState(true)
  const [selectedColumns, setSelectedColumns] = useState(columns.map(c => c.header || c))
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [orientation, setOrientation] = useState('portrait')
  
  const reportRef = useRef()
  const toast = useToast()

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    onBeforeGetContent: () => {
      onPrintStart?.()
      return Promise.resolve()
    },
    onAfterPrint: () => {
      onPrintComplete?.()
      toast.success('Report sent to printer')
    },
    onPrintError: (error) => {
      console.error('Print failed:', error)
      toast.error('Failed to print report')
    }
  })

  const handlePrintWithOptions = () => {
    setShowOptions(false)
    
    // Add delay for UI to close
    setTimeout(() => {
      handlePrint()
    }, 100)
  }

  const handlePreview = () => {
    setShowOptions(false)
    // Open print preview
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const prepareData = () => {
    // Filter data based on date range if provided
    let filteredData = data
    if (startDate && endDate) {
      // Add date filtering logic here based on your data structure
    }

    return filteredData
  }

  // Simple button variant
  if (variant === 'button') {
    return (
      <Button
        variant="primary"
        size={size}
        onClick={handlePrint}
        icon={Printer}
        className={className}
      >
        Print Report
      </Button>
    )
  }

  return (
    <>
      {/* Hidden Report Template for Printing */}
      <div style={{ display: 'none' }}>
        <div ref={reportRef}>
          <ReportTemplate
            data={prepareData()}
            title={reportTitle}
            dateRange={dateRange || (startDate && endDate ? `${startDate} to ${endDate}` : undefined)}
            filters={includeFilters ? filters : {}}
            summary={includeSummary ? summary : []}
            columns={selectedColumns}
            type={type}
          />
        </div>
      </div>

      {/* Print Button with Options */}
      <div className="relative">
        <Button
          variant="primary"
          size={size}
          onClick={() => setShowOptions(!showOptions)}
          icon={Printer}
          className={className}
        >
          Print Report
        </Button>

        {showOptions && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowOptions(false)}
            />
            
            <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-white">Print Options</h3>
                <button onClick={() => setShowOptions(false)}>
                  <X size={18} className="text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Report Title */}
              <div className="mb-4">
                <Input
                  label="Report Title"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Enter report title"
                />
              </div>

              {/* Date Range Toggle */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <input
                    type="checkbox"
                    checked={showDatePicker}
                    onChange={(e) => setShowDatePicker(e.target.checked)}
                    className="rounded border-slate-600 bg-slate-700"
                  />
                  <span>Filter by Date Range</span>
                </label>
                
                {showDatePicker && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      type="date"
                      label="From"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input
                      type="date"
                      label="To"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Page Orientation */}
              <div className="mb-4">
                <label className="text-sm text-gray-300 block mb-2">Page Orientation</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition ${
                      orientation === 'portrait' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition ${
                      orientation === 'landscape' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>

              {/* Include Options */}
              <div className="space-y-2 mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={includeSummary}
                    onChange={(e) => setIncludeSummary(e.target.checked)}
                    className="rounded border-slate-600 bg-slate-700"
                  />
                  <span>Include Summary Cards</span>
                </label>
                
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={includeFilters}
                    onChange={(e) => setIncludeFilters(e.target.checked)}
                    className="rounded border-slate-600 bg-slate-700"
                  />
                  <span>Include Applied Filters</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePrintWithOptions}
                  icon={Printer}
                  className="flex-1"
                >
                  Print
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreview}
                  icon={Download}
                  className="flex-1"
                >
                  Preview
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

// Preset print buttons for common use cases
export const PrintFleetReport = ({ data, summary, ...props }) => {
  const columns = ['Registration', 'Type', 'Status', 'Hours', 'Cycles', 'Last Maintenance']
  
  const defaultSummary = summary || [
    { label: 'Total Aircraft', value: data?.length || 0 },
    { label: 'Active', value: data?.filter(a => a.status === 'Active').length || 0 },
    { label: 'In Maintenance', value: data?.filter(a => a.status === 'Maintenance').length || 0 },
    { label: 'Total Hours', value: data?.reduce((acc, a) => acc + a.hours, 0).toLocaleString() || 0 },
  ]

  return (
    <PrintButton
      data={data}
      title="Fleet Status Report"
      columns={columns}
      summary={defaultSummary}
      type="fleet"
      {...props}
    />
  )
}

export const PrintDefectReport = ({ data, aircraft, ...props }) => {
  const columns = ['Description', 'Severity', 'Status', 'Date']
  
  const summary = [
    { label: 'Total Defects', value: data?.length || 0 },
    { label: 'Open', value: data?.filter(d => d.status === 'Open').length || 0 },
    { label: 'High Severity', value: data?.filter(d => d.severity === 'High').length || 0 },
    { label: 'Aircraft', value: aircraft || 'All' },
  ]

  return (
    <PrintButton
      data={data}
      title="Defect Analysis Report"
      columns={columns}
      summary={summary}
      type="defects"
      {...props}
    />
  )
}

export default PrintButton
