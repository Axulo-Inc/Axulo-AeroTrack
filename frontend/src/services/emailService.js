// Email service utility - simulates sending emails
// In production, this would connect to a backend API

// Mock email sending function
export const sendEmail = async (options) => {
  console.log('📧 Sending email:', options)
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Return success (in production, this would be the API response)
  return {
    success: true,
    messageId: `msg_${Date.now()}`,
    timestamp: new Date().toISOString()
  }
}

// Email templates
export const emailTemplates = {
  fleetReport: (data) => ({
    subject: `Fleet Status Report - ${new Date().toLocaleDateString()}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
          .summary { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 20px 0; }
          .card { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .label { color: #64748b; font-size: 12px; text-transform: uppercase; }
          .value { font-size: 24px; font-weight: bold; color: #0f172a; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th { background: #f1f5f9; padding: 10px; text-align: left; }
          .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; }
          .button { background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Axulo AeroTrack</h1>
            <p>Fleet Status Report</p>
          </div>
          <div class="content">
            <p>Dear User,</p>
            <p>Here is your scheduled fleet status report for ${new Date().toLocaleDateString()}.</p>
            
            <div class="summary">
              <div class="card">
                <div class="label">Total Aircraft</div>
                <div class="value">${data.totalAircraft || 0}</div>
              </div>
              <div class="card">
                <div class="label">Active</div>
                <div class="value">${data.active || 0}</div>
              </div>
              <div class="card">
                <div class="label">In Maintenance</div>
                <div class="value">${data.maintenance || 0}</div>
              </div>
              <div class="card">
                <div class="label">Total Hours</div>
                <div class="value">${data.totalHours?.toLocaleString() || 0}</div>
              </div>
            </div>

            <h3>Fleet Summary</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Registration</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                ${data.aircraft?.map(a => `
                  <tr>
                    <td>${a.registration}</td>
                    <td>${a.type}</td>
                    <td>${a.status}</td>
                    <td>${a.hours.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <p style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:5173/fleet" class="button">View Full Report</a>
            </p>
          </div>
          <div class="footer">
            <p>© 2026 Axulo AeroTrack. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  defectReport: (data) => ({
    subject: `Defect Analysis Report - ${new Date().toLocaleDateString()}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
          .summary { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 20px 0; }
          .card { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .label { color: #64748b; font-size: 12px; text-transform: uppercase; }
          .value { font-size: 24px; font-weight: bold; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
          .badge-high { background: #fee2e2; color: #991b1b; }
          .badge-medium { background: #fef3c7; color: #92400e; }
          .badge-low { background: #dbeafe; color: #1e40af; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th { background: #f1f5f9; padding: 10px; text-align: left; }
          .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Axulo AeroTrack</h1>
            <p>Defect Analysis Report</p>
          </div>
          <div class="content">
            <p>Dear User,</p>
            <p>Here is your scheduled defect analysis report for ${new Date().toLocaleDateString()}.</p>
            
            <div class="summary">
              <div class="card">
                <div class="label">Total Defects</div>
                <div class="value">${data.totalDefects || 0}</div>
              </div>
              <div class="card">
                <div class="label">Open</div>
                <div class="value" style="color: #dc2626;">${data.open || 0}</div>
              </div>
              <div class="card">
                <div class="label">High Severity</div>
                <div class="value" style="color: #dc2626;">${data.highSeverity || 0}</div>
              </div>
              <div class="card">
                <div class="label">MTBF</div>
                <div class="value">${data.mtbf || 0}h</div>
              </div>
            </div>

            <h3>Recent Defects</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Aircraft</th>
                  <th>Description</th>
                  <th>Severity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${data.defects?.map(d => `
                  <tr>
                    <td>${d.aircraft}</td>
                    <td>${d.description}</td>
                    <td><span class="badge badge-${d.severity?.toLowerCase()}">${d.severity}</span></td>
                    <td>${d.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="footer">
            <p>© 2026 Axulo AeroTrack. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
}

// Schedule email function (stores scheduled reports in localStorage)
export const scheduleEmail = (schedule) => {
  const schedules = JSON.parse(localStorage.getItem('email_schedules') || '[]')
  const newSchedule = {
    id: Date.now().toString(),
    ...schedule,
    createdAt: new Date().toISOString(),
    nextRun: calculateNextRun(schedule.frequency, schedule.startDate)
  }
  
  schedules.push(newSchedule)
  localStorage.setItem('email_schedules', JSON.stringify(schedules))
  
  return newSchedule
}

// Calculate next run date based on frequency
const calculateNextRun = (frequency, startDate) => {
  const date = new Date(startDate || new Date())
  
  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + 1)
      break
    case 'weekly':
      date.setDate(date.getDate() + 7)
      break
    case 'monthly':
      date.setMonth(date.getMonth() + 1)
      break
    case 'quarterly':
      date.setMonth(date.getMonth() + 3)
      break
    default:
      date.setDate(date.getDate() + 1)
  }
  
  return date.toISOString()
}

// Get all scheduled emails
export const getScheduledEmails = () => {
  return JSON.parse(localStorage.getItem('email_schedules') || '[]')
}

// Delete scheduled email
export const deleteScheduledEmail = (id) => {
  const schedules = JSON.parse(localStorage.getItem('email_schedules') || '[]')
  const filtered = schedules.filter(s => s.id !== id)
  localStorage.setItem('email_schedules', JSON.stringify(filtered))
  return filtered
}

// Update scheduled email
export const updateScheduledEmail = (id, updates) => {
  const schedules = JSON.parse(localStorage.getItem('email_schedules') || '[]')
  const updated = schedules.map(s => 
    s.id === id ? { ...s, ...ups } : s
  )
  localStorage.setItem('email_schedules', JSON.stringify(updated))
  return updated
}
