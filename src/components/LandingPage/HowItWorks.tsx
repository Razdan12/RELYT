import { Badge } from "@/components/ui/badge"
import { Plus, Settings, Bell } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Plus,
      title: "Create Project",
      description: "Sign up and create a new project in seconds",
      color: "#00E5FF",
    },
    {
      number: "02",
      icon: Settings,
      title: "Add Check",
      description: "Set up HTTP monitoring or heartbeat check",
      color: "#9B5CFF",
    },
    {
      number: "03",
      icon: Bell,
      title: "Enable Notifications",
      description: "Receive alerts via webhook, email, or Slack",
      color: "#14F195",
    },
  ]

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
            <span className="text-gradient-cyan">How It Works</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto text-pretty">
            Set up monitoring in 3 easy steps. No complex configuration required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="glassmorphism border border-white/10 hover:border-white/20 transition-all duration-300 h-full rounded-xl p-8 text-center bg-card/50">
                <div className="relative mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${step.color}20` }}
                  >
                    <step.icon className="w-8 h-8" style={{ color: step.color }} />
                  </div>
                  <Badge
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: step.color, color: "#000" }}
                  >
                    {step.number}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-white/20 to-transparent transform -translate-y-1/2 z-10" />
              )}
            </div>
          ))}
        </div>

        {/* Code Snippet */}
        <div className="max-w-4xl mx-auto">
          <div className="glassmorphism rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Heartbeat Check Example</h3>
              <Badge className="bg-[#14F195]/20 text-[#14F195] border-[#14F195]/30">cURL</Badge>
            </div>
            <div className="bg-black/50 rounded-2xl p-6 font-mono text-sm overflow-x-auto">
              <div className="text-gray-400 mb-2"># Send heartbeat from your cron job</div>
              <div className="text-[#00E5FF]">curl -X POST \</div>
              <div className="text-white ml-4">https://api.reliability-lite.app/v1/check/hb/</div>
              <div className="text-[#9B5CFF] ml-4">{"<TOKEN>"}</div>
              <div className="text-gray-400 mt-4"># Secure token with hash, no sensitive data</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
