import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Shield, Clock, Globe } from "lucide-react";
import { BorderBeam } from "../ui/border-beam";
import { useNavigate } from "react-router-dom";
import { listed } from "@/constant/listed";

export function Hero() {
  const navigate = useNavigate()
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F14] via-[#121A26] to-[#0B0F14]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9B5CFF]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="flex justify-center lg:justify-start mb-6">
              <Badge className="glassmorphism text-[#00E5FF] border-[#00E5FF]/30 px-4 py-2 text-sm">
                <Shield className="w-4 h-4 mr-2" />
                Multi-Project • Secure Tokens (hash) • Quiet Hours
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-balance">
              <span className="text-gradient-cyan">Monitor Services</span>
              <br />
              <span className="text-white">Without Drama.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-300 mb-8 text-pretty leading-relaxed max-w-2xl">
              HTTP & Heartbeat monitoring, automatic incidents, public status
              page—ready in minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button className="btn btn-ghost hover:border-[#00E5FF] bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-black font-semibold rounded-full px-8 text-lg glow-cyan group"
              onClick={() => navigate(listed.register)}
              >
                Start Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn btn-ghost border-white/20 text-white hover:bg-white/10 rounded-full px-8  text-lg group bg-transparent">
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="flex items-center glassmorphism px-4 py-2 rounded-full text-sm text-gray-300">
                <Clock className="w-4 h-4 mr-2 text-[#00E5FF]" />
                2-minute setup
              </div>
              <div className="flex items-center glassmorphism px-4 py-2 rounded-full text-sm text-gray-300">
                <Globe className="w-4 h-4 mr-2 text-[#9B5CFF]" />
                Public status page
              </div>
              <div className="flex items-center glassmorphism px-4 py-2 rounded-full text-sm text-gray-300">
                <Shield className="w-4 h-4 mr-2 text-[#14F195]" />
                HMAC webhook
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Mockup */}
          <div className="relative">
            <div className="glassmorphism rounded-3xl p-6 glow-cyan">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Dashboard Overview
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#14F195] rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">
                    All systems operational
                  </span>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glassmorphism rounded-2xl p-4">
                  <div className="text-2xl font-bold text-[#14F195] mb-1">
                    99.9%
                  </div>
                  <div className="text-sm text-gray-400">Uptime 30d</div>
                </div>
                <div className="glassmorphism rounded-2xl p-4">
                  <div className="text-2xl font-bold text-[#00E5FF] mb-1">
                    142ms
                  </div>
                  <div className="text-sm text-gray-400">Avg Response</div>
                </div>
                <div className="glassmorphism rounded-2xl p-4">
                  <div className="text-2xl font-bold text-[#9B5CFF] mb-1">
                    12
                  </div>
                  <div className="text-sm text-gray-400">Active Checks</div>
                </div>
                <div className="glassmorphism rounded-2xl p-4">
                  <div className="text-2xl font-bold text-white mb-1">0</div>
                  <div className="text-sm text-gray-400">Open Incidents</div>
                </div>
              </div>

              {/* Mock Chart */}
              <div className="glassmorphism rounded-2xl p-4">
                <div className="text-sm text-gray-400 mb-3">
                  Response Time (24h)
                </div>
                <div className="h-20 flex items-end space-x-1">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-[#00E5FF]/50 to-[#00E5FF] rounded-sm"
                      style={{ height: `${Math.random() * 60 + 20}%` }}
                    />
                  ))}
                </div>
              </div>

              <BorderBeam
                duration={6}
                size={300}
                className="from-transparent via-cyan-500 to-transparent"
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 glassmorphism rounded-2xl p-3 glow-purple">
              <div className="text-xs text-gray-400 mb-1">Latest Check</div>
              <div className="text-sm text-[#14F195] font-semibold">
                ✓ API Healthy
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 glassmorphism rounded-2xl p-3">
              <div className="text-xs text-gray-400 mb-1">Incident</div>
              <div className="text-sm text-gray-300">None active</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
