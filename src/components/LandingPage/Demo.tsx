// src/components/LandingPage/Demo.tsx
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, CheckCircle, Clock } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

export function Demo() {
  const chartData = {
    series: [
      { name: "Latency (ms)", data: [120, 135, 145, 128, 142, 138, 125] },
    ],
    options: {
      chart: {
        type: "line",
        height: 192,
        background: "transparent",
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      theme: { mode: "dark" },
      stroke: { curve: "smooth", width: 2, colors: ["#00E5FF"] },
      grid: { show: false },
      xaxis: {
        categories: ["00:00","04:00","08:00","12:00","16:00","20:00","24:00"],
        labels: { style: { colors: "#9CA3AF", fontSize: "12px" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { show: false },
      tooltip: { theme: "dark", style: { fontSize: "12px" } },
      markers: { size: 0 },
    } as ApexOptions,
  };

  const recentRuns = [
    { time: "2 min ago", status: "success", response: "142ms", location: "Singapore" },
    { time: "7 min ago", status: "success", response: "138ms", location: "Singapore" },
    { time: "12 min ago", status: "success", response: "145ms", location: "Singapore" },
  ];

  return (
    <section id="demo" className="py-20 bg-gradient-to-b from-[#121A26] to-[#0B0F14]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
            <span className="text-gradient-purple">Interactive Demo</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto text-pretty">
            See how Reliability Lite monitors your services in real-time.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Uptime Chart */}
            <div className="glassmorphism border border-white/10 rounded-xl p-6 bg-card/50">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-white text-lg font-semibold">Uptime & Latency (24h)</span>
                  <div className="bg-[#14F195]/20 text-[#14F195] border-[#14F195]/30 inline-flex items-center px-2 py-1 rounded-md text-sm">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Operational
                  </div>
                </div>
              </div>
              <div>
                <div className="h-48 mb-4">
                  <ReactApexChart
                    options={chartData.options}
                    series={chartData.series}
                    type="line"
                    height={192}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#14F195] mb-1">99.9%</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00E5FF] mb-1">135ms</div>
                    <div className="text-sm text-gray-400">Avg Latency</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Runs */}
            <div className="glassmorphism border border-white/10 rounded-xl p-6 bg-card/50">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-white text-lg font-semibold">Recent Runs</span>
                  <TrendingUp className="w-5 h-5 text-[#9B5CFF]" />
                </div>
              </div>
              <div>
                <div className="space-y-4">
                  {recentRuns.map((run, index) => (
                    <div key={index} className="flex items-center justify-between p-3 glassmorphism rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-[#14F195] rounded-full" />
                        <div>
                          <div className="text-sm text-white font-medium">{run.location}</div>
                          <div className="text-xs text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {run.time}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-[#00E5FF] font-medium">{run.response}</div>
                        <div className="text-xs text-gray-400">Response</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="text-center">
                    <Button className="bg-[#9B5CFF] hover:bg-[#9B5CFF]/90 text-white rounded-2xl glow-purple">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Live Demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

         {/* Wow Section */}
          <div className="glassmorphism border border-white/10 rounded-xl p-8 bg-card/50">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Advanced Features</h3>
              <p className="text-gray-300">More than just basic monitoring</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#00E5FF]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-[#00E5FF]" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Escalation & Quiet Hours</h4>
                <p className="text-sm text-gray-400">Set flexible notification schedules and escalation policies</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#9B5CFF]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-[#9B5CFF]" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Multi-region Monitoring</h4>
                <p className="text-sm text-gray-400">Check from multiple locations for maximum accuracy</p>
                <div className="mt-2 bg-[#9B5CFF]/20 text-[#9B5CFF] border-[#9B5CFF]/30 text-xs">Pro Feature</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#14F195]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-[#14F195]" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">HMAC Webhook</h4>
                <p className="text-sm text-gray-400">Enterprise-grade security with signature verification</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
