import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Lock, Star } from "lucide-react"

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for personal projects and startups",
      features: [
        "5 HTTP/Heartbeat checks",
        "2 webhook endpoints",
        "1 notification channel",
        "24 hours data retention",
        "Email support",
      ],
      lockedFeatures: ["Public status page", "Multi-region monitoring", "Custom domains"],
      cta: "Try Free",
      popular: false,
      color: "#6B7280",
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For small teams and growing businesses",
      features: [
        "100 HTTP/Heartbeat checks",
        "20 webhook endpoints",
        "5 notification channels",
        "30 days data retention",
        "Public status page",
        "Custom branding",
        "Priority support",
      ],
      lockedFeatures: ["Multi-region monitoring", "Advanced analytics"],
      cta: "Upgrade to Pro",
      popular: true,
      color: "#00E5FF",
    },
    {
      name: "Business",
      price: "$59",
      period: "/month",
      description: "For enterprises with high-volume needs",
      features: [
        "1000 HTTP/Heartbeat checks",
        "200 webhook endpoints",
        "20 notification channels",
        "90 days data retention",
        "Multi-region monitoring",
        "Advanced analytics",
        "Custom domains",
        "SLA guarantee",
        "Dedicated support",
      ],
      lockedFeatures: [],
      cta: "Contact Sales",
      popular: false,
      color: "#9B5CFF",
    },
  ]

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
            <span className="text-gradient-cyan">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto text-pretty">
            Start free, upgrade as you grow. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`glassmorphism border border-white/10 hover:border-white/20 transition-all duration-300 relative rounded-xl bg-card/50 ${
                plan.popular ? "scale-105 border-[#00E5FF]/30" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-[#00E5FF] text-black px-4 py-1 font-semibold">
                    <Star className="w-3 h-3 mr-1" />
                    Recommended
                  </Badge>
                </div>
              )}

              <div className="text-center pb-4 p-6">
                <div className="text-2xl font-bold text-white mb-2">{plan.name}</div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-300 text-sm">{plan.description}</p>
              </div>

              <div className="pt-0 p-6">
                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-4 h-4 text-[#14F195] flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.lockedFeatures.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3 opacity-50">
                      <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-500 text-sm line-through">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full rounded-2xl font-semibold ${
                    plan.popular
                      ? "bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-black glow-cyan"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">All plans include SSL monitoring and incident management</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span>✓ 14-day money-back guarantee</span>
            <span>✓ Cancel anytime</span>
            <span>✓ No setup fees</span>
          </div>
        </div>
      </div>
    </section>
  )
}
