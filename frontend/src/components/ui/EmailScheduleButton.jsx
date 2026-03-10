import { useState, useEffect } from 'react'
import { 
  Mail, 
  Calendar, 
  Clock, 
  Users, 
  X, 
  Edit2, 
  Trash2,
  Send,
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react'
import Button from './Button'
import Input from './Input'
import Select from './Select'
import Card from './Card'
import { useToast } from './Toast'
import { sendEmail, emailTemplates, scheduleEmail, getScheduledEmails, deleteScheduledEmail } from '../../services/emailService'

const EmailScheduleButton = ({
  data,
  type = 'fleet',
  title = 'Fleet Report',
  recipients: propRecipients = [],
  className = ''
}) => {
  const [showDialog, setShowDialog] = useState(false)
  const [showSchedules, setShowSchedules] = useState(false)
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [emailData, setEmailData] = useState({
    recipients: propRecipients.join(', '),
    subject: `${title} - ${new Date().toLocaleDateString()}`,
    message: '',
    frequency: 'one-time',
    startDate: new Date().toISOString().split('T')[0],
    time: '09:00',
    includeAttachments: true
  })
  
  const toast = useToast()

  // Load schedules on mount
  useEffect(() => {
    if (showSchedules) {
      loadSchedules()
    }
  }, [showSchedules])

  const loadSchedules = () => {
    const saved = getScheduledEmails()
    setSchedules(saved.filter(s => s.type === type))
  }

  const handleSendNow = async () => {
    if (!emailData.recipients.trim()) {
      toast.error('Please enter at least one recipient email')
      return
    }

    setLoading(true)
    
    try {
      // Prepare report data
      let reportData = {}
      if (type === 'fleet') {
        reportData = {
          totalAircraft: data.length,
          active: data.filter(a => a.status === 'Active').length,
          maintenance: data.filter(a => a.status === 'Maintenance').length,
          totalHours: data.reduce((acc, a) => acc + a.hours, 0),
          aircraft: data.slice(0, 10) // Limit to 10 for email
        }
      } else if (type === 'defects') {
        reportData = {
          totalDefects: data.length,
          open: data.filter(d => d.status === 'Open').length,
          highSeverity: data.filter(d => d.severity === 'High').length,
          defects: data.slice(0, 10)
        }
      }

      // Get template
      const template = type === 'fleet' 
        ? emailTemplates.fleetReport(reportData)
        : emailTemplates.defectReport(reportData)

      // Send email
      const result = await sendEmail({
        to: emailData.recipients.split(',').map(r => r.trim()),
        subject: emailData.subject || template.subject,
        html: template.html,
        attachments: emailData.includeAttachments ? data : null
      })

      if (result.success) {
        toast.success('Email sent successfully!')
        setShowDialog(false)
      }
    } catch (error) {
      toast.error('Failed to send email')
    } finally {
      setLoading(false)
    }
  }

  const handleSchedule = () => {
    if (!emailData.recipients.trim()) {
      toast.error('Please enter at least one recipient email')
      return
    }

    const scheduled = scheduleEmail({
      type,
      title,
      recipients: emailData.recipients.split(',').map(r => r.trim()),
      subject: emailData.subject,
      frequency: emailData.frequency,
      startDate: emailData.startDate,
      time: emailData.time,
      includeAttachments: emailData.includeAttachments,
      data: data // In production, you'd store filters/params, not the actual data
    })

    toast.success(`Report scheduled ${emailData.frequency !== 'one-time' ? 'recurring' : 'for one-time'}`)
    setShowDialog(false)
    loadSchedules()
  }

  const handleDeleteSchedule = (id) => {
    deleteScheduledEmail(id)
    loadSchedules()
    toast.success('Schedule deleted')
  }

  const frequencyOptions = [
    { value: 'one-time', label: 'One Time' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ]

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setShowDialog(true)}
        icon={Mail}
        className={className}
      >
        Email Report
      </Button>

      {/* Email Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowDialog(false)} />
          
          <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Card.Header>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Send Report via Email</h3>
                <button onClick={() => setShowDialog(false)}>
                  <X size={20} className="text-gray-400 hover:text-white" />
                </button>
              </div>
            </Card.Header>
            
            <Card.Body>
              <div className="space-y-4">
                {/* Recipients */}
                <Input
                  label="Recipients"
                  placeholder="email1@example.com, email2@example.com"
                  value={emailData.recipients}
                  onChange={(e) => setEmailData({...emailData, recipients: e.target.value})}
                  helper="Separate multiple emails with commas"
                />

                {/* Subject */}
                <Input
                  label="Email Subject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                />

                {/* Schedule Type */}
                <Select
                  label="Schedule"
                  options={frequencyOptions}
                  value={emailData.frequency}
                  onChange={(e) => setEmailData({...emailData, frequency: e.target.value})}
                />

                {/* Date and Time (for scheduled) */}
                {emailData.frequency !== 'one-time' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      label="Start Date"
                      value={emailData.startDate}
                      onChange={(e) => setEmailData({...emailData, startDate: e.target.value})}
                    />
                    <Input
                      type="time"
                      label="Time"
                      value={emailData.time}
                      onChange={(e) => setEmailData({...emailData, time: e.target.value})}
                    />
                  </div>
                )}

                {/* Options */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={emailData.includeAttachments}
                      onChange={(e) => setEmailData({...emailData, includeAttachments: e.target.checked})}
                      className="rounded border-slate-600 bg-slate-700"
                    />
                    <span>Include data attachment (CSV)</span>
                  </label>
                </div>

                {/* Preview Info */}
                <div className="bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Report Preview</h4>
                  <p className="text-sm text-gray-400">
                    Type: {type === 'fleet' ? 'Fleet Status Report' : 'Defect Analysis Report'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Records: {data.length} items
                  </p>
                  {type === 'fleet' && (
                    <p className="text-sm text-gray-400">
                      Summary: {data.filter(a => a.status === 'Active').length} Active, {' '}
                      {data.filter(a => a.status === 'Maintenance').length} In Maintenance
                    </p>
                  )}
                </div>
              </div>
            </Card.Body>
            
            <Card.Footer>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSendNow}
                  isLoading={loading}
                  icon={Send}
                >
                  Send Now
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleSchedule}
                  icon={Calendar}
                >
                  Schedule
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </div>
      )}

      {/* Schedules Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowSchedules(true)}
        icon={Clock}
        className="ml-2"
      >
        Schedules
      </Button>

      {/* Schedules Dialog */}
      {showSchedules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowSchedules(false)} />
          
          <Card className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <Card.Header>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Scheduled Reports</h3>
                <button onClick={() => setShowSchedules(false)}>
                  <X size={20} className="text-gray-400 hover:text-white" />
                </button>
              </div>
            </Card.Header>
            
            <Card.Body>
              {schedules.length === 0 ? (
                <div className="text-center py-8">
                  <Mail size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">No scheduled reports yet</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowSchedules(false)
                      setShowDialog(true)
                    }}
                    icon={Plus}
                    className="mt-4"
                  >
                    Schedule Your First Report
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="bg-slate-900 p-4 rounded-lg hover:bg-slate-800 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-white">{schedule.title}</h4>
                          <p className="text-sm text-gray-400 mt-1">
                            To: {schedule.recipients.join(', ')}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Calendar size={12} />
                              {schedule.frequency}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <Clock size={12} />
                              {new Date(schedule.nextRun).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="p-1 hover:bg-slate-700 rounded"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      )}
    </>
  )
}

// Preset email buttons
export const EmailFleetReport = ({ data, ...props }) => (
  <EmailScheduleButton
    data={data}
    type="fleet"
    title="Fleet Status Report"
    {...props}
  />
)

export const EmailDefectReport = ({ data, ...props }) => (
  <EmailScheduleButton
    data={data}
    type="defects"
    title="Defect Analysis Report"
    {...props}
  />
)

export default EmailScheduleButton
