import { Button } from "@/components/ui/button"
import { Server, Activity, AlertTriangle, Globe, ArrowRight } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Server,
      title: "HTTP Checks",
      description: "Monitor API endpoints and websites with periodic requests",
      bullets: [
        "3 failures in 5 minutes → incident OPEN",
        "SLA tracking & latency monitoring",
        "Custom headers & authentication",
      ],
      color: "#00E5FF",
    },
    {
      icon: Activity,
      title: "Heartbeat Checks",
      description: "Monitor cron jobs and background workers",
      bullets: [
        "Missed heartbeat → we notify you",
        "Flexible interval (1 minute - 24 hours)",
        "Grace period for deployments",
      ],
      color: "#9B5CFF",
    },
    {
      icon: AlertTriangle,
      title: "Automatic Incidents",
      description: "Open and close incidents automatically",
      bullets: [
        "Auto-resolve when service recovers",
        "Postmortem templates available",
        "Complete timeline for debugging",
      ],
      color: "#14F195",
    },
    {
      icon: Globe,
      title: "Public Status Page",
      description: "Share service status with team and customers",
      bullets: ["30-day Uptime Badge • HMAC Webhook", "Custom domain & branding", "Shareable link for transparency"],
      color: "#FF6B6B",
    },
  ]

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-[#0B0F14] to-[#121A26]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
            <span className="text-gradient-purple">Core Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto text-pretty">
            Everything you need for reliable monitoring, in one easy-to-use platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glassmorphism border border-white/10 hover:border-white/20 transition-all duration-300 group rounded-xl p-8 bg-card/50"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-2xl flex-shrink-0" style={{ backgroundColor: `${feature.color}20` }}>
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-2 mb-6">
                    {feature.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="flex items-start space-x-2 text-sm text-gray-400">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: feature.color }}
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white p-0 h-auto group-hover:translate-x-1 transition-transform"
                  >
                    Learn more
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
