import { useState } from "react"
import { 
  Card, 
  Button, 
  Input, 
  Tabs,
  Badge
} from "../components/ui"
import { 
  HelpCircle, 
  Search, 
  Book, 
  Video, 
  MessageCircle,
  Mail,
  FileText,
  ExternalLink,
  Download,
  ChevronRight,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'

function Help() {
  const [searchTerm, setSearchTerm] = useState('')
  const [helpful, setHelpful] = useState(null)

  const faqs = [
    {
      question: "How do I add a new aircraft to the fleet?",
      answer: "Go to Fleet Management and click the 'Add Aircraft' button in the top right corner. Fill in the aircraft details including registration, type, and initial flight hours.",
      category: "fleet"
    },
    {
      question: "How do I report a defect?",
      answer: "Navigate to the aircraft details page and click the 'Add Defect' button. Fill in the description, severity level, and status. The defect will immediately appear in the defect log.",
      category: "defects"
    },
    {
      question: "How do I schedule maintenance?",
      answer: "Go to the Maintenance page and click 'Schedule Maintenance'. Select the aircraft, task type, priority, and scheduled date. You can also assign technicians to the task.",
      category: "maintenance"
    },
    {
      question: "How do I export fleet data?",
      answer: "On the Fleet page, click the 'Export' button. Choose your preferred format (CSV, JSON, or Excel). You can also select which columns to include before exporting.",
      category: "export"
    },
    {
      question: "How do I save my column layout?",
      answer: "After arranging columns the way you want, click the 'Save View' button next to the search bar. Give your view a name and it will be saved for future use.",
      category: "views"
    },
    {
      question: "How do I schedule email reports?",
      answer: "Click the 'Email Report' button on any page, enter recipients, and choose a schedule (daily, weekly, monthly). The reports will be automatically sent at your specified time.",
      category: "email"
    },
    {
      question: "How do I print a report?",
      answer: "Click the 'Print Report' button and customize your print options including title, date range, and orientation. Use 'Preview' to see how it will look before printing.",
      category: "print"
    },
    {
      question: "How do I change the theme?",
      answer: "Click the theme icon (🌓) in the top right corner to toggle between light and dark mode. For more options, go to Settings > Appearance.",
      category: "appearance"
    },
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page. Enter your email address and you'll receive instructions to reset your password.",
      category: "account"
    },
    {
      question: "How do I invite team members?",
      answer: "Go to Settings > Team Management (coming soon). You'll be able to invite team members via email and assign different roles.",
      category: "team"
    }
  ]

  const guides = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of Axulo AeroTrack in 10 minutes",
      icon: Book,
      color: "blue",
      readTime: "5 min"
    },
    {
      title: "Fleet Management",
      description: "Complete guide to managing your aircraft fleet",
      icon: FileText,
      color: "green",
      readTime: "8 min"
    },
    {
      title: "Defect Tracking",
      description: "How to effectively track and manage defects",
      icon: FileText,
      color: "yellow",
      readTime: "6 min"
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      icon: Video,
      color: "purple",
      readTime: "15 min"
    }
  ]

  const resources = [
    {
      title: "API Documentation",
      description: "Integrate Axulo AeroTrack with your systems",
      icon: FileText,
      link: "#"
    },
    {
      title: "Release Notes",
      description: "See what's new in the latest version",
      icon: Star,
      link: "#"
    },
    {
      title: "Best Practices",
      description: "Tips from aviation maintenance experts",
      icon: Book,
      link: "#"
    },
    {
      title: "Compliance Guide",
      description: "Regulatory compliance information",
      icon: FileText,
      link: "#"
    }
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tabs = [
    {
      id: 'faq',
      label: 'FAQ',
      icon: HelpCircle,
      badge: filteredFaqs.length,
      content: (
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* FAQs */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <Card>
                <Card.Body>
                  <p className="text-center text-gray-400 py-8">No FAQs found matching your search</p>
                </Card.Body>
              </Card>
            ) : (
              filteredFaqs.map((faq, index) => (
                <Card key={index}>
                  <Card.Body>
                    <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                    <p className="text-gray-400 text-sm mb-3">{faq.answer}</p>
                    <div className="flex items-center gap-4">
                      <Badge variant="default" size="sm">{faq.category}</Badge>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Was this helpful?</span>
                        <button 
                          onClick={() => setHelpful('yes')}
                          className={`hover:text-green-400 ${helpful === 'yes' ? 'text-green-400' : ''}`}
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button 
                          onClick={() => setHelpful('no')}
                          className={`hover:text-red-400 ${helpful === 'no' ? 'text-red-400' : ''}`}
                        >
                          <ThumbsDown size={14} />
                        </button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </div>
      )
    },
    {
      id: 'guides',
      label: 'Guides',
      icon: Book,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide, index) => {
            const Icon = guide.icon
            const colors = {
              blue: 'bg-blue-500/20 text-blue-400',
              green: 'bg-green-500/20 text-green-400',
              yellow: 'bg-yellow-500/20 text-yellow-400',
              purple: 'bg-purple-500/20 text-purple-400'
            }
            return (
              <Card key={index} hoverable>
                <Card.Body>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${colors[guide.color]}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">{guide.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{guide.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{guide.readTime} read</span>
                        <Button variant="ghost" size="sm" icon={ChevronRight}>
                          Read
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )
          })}
        </div>
      )
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: FileText,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, index) => {
            const Icon = resource.icon
            return (
              <Card key={index} hoverable>
                <Card.Body>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-700 rounded-lg">
                      <Icon size={24} className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">{resource.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{resource.description}</p>
                      <a 
                        href={resource.link} 
                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                        onClick={(e) => {
                          e.preventDefault()
                          toast.info('Resource link - demo only')
                        }}
                      >
                        View <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )
          })}
        </div>
      )
    },
    {
      id: 'contact',
      label: 'Contact Support',
      icon: MessageCircle,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg">
                  <Mail className="text-blue-400" size={20} />
                  <div>
                    <p className="text-white font-medium">Email Support</p>
                    <p className="text-sm text-gray-400">support@axulo.aero</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg">
                  <MessageCircle className="text-green-400" size={20} />
                  <div>
                    <p className="text-white font-medium">Live Chat</p>
                    <p className="text-sm text-gray-400">Available 24/7</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg">
                  <HelpCircle className="text-yellow-400" size={20} />
                  <div>
                    <p className="text-white font-medium">Knowledge Base</p>
                    <p className="text-sm text-gray-400">Search our documentation</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-white">Send a Message</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <Input
                  label="Subject"
                  placeholder="Brief description of your issue"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-slate-900 text-white rounded-lg border border-slate-700 p-3 focus:outline-none focus:border-blue-500"
                    placeholder="Describe your issue in detail..."
                  />
                </div>
                <Button variant="primary" fullWidth>
                  Send Message
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="md:col-span-2">
            <Card.Header>
              <h3 className="text-lg font-semibold text-white">Support Hours</h3>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-white font-medium">Monday - Friday</p>
                  <p className="text-sm text-gray-400">24 hours</p>
                </div>
                <div>
                  <p className="text-white font-medium">Saturday</p>
                  <p className="text-sm text-gray-400">08:00 - 20:00 GMT+2</p>
                </div>
                <div>
                  <p className="text-white font-medium">Sunday</p>
                  <p className="text-sm text-gray-400">Emergency only</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )
    }
  ]

  return (
    <div className="p-6 text-white bg-slate-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Help & Support</h1>
      
      <Tabs tabs={tabs} defaultTab="faq" variant="pills" />
    </div>
  )
}

export default Help
