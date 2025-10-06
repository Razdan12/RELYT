"use client"

import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"
import { useState, useEffect } from "react"

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      quote:
        "Reliability Lite transformed how we monitor our APIs. Setup took just 5 minutes, but the impact on our reliability team has been huge.",
      author: "Sarah Chen",
      role: "DevOps Engineer",
      company: "TechCorp",
      rating: 5,
      avatar: "/professional-woman-avatar.png",
    },
    {
      quote:
        "The heartbeat monitoring is perfect for our cron jobs. Finally, I can sleep peacefully without worrying about our billing system failing.",
      author: "Ahmad Rizki",
      role: "Backend Developer",
      company: "FinanceApp",
      rating: 5,
      avatar: "/professional-man-avatar.png",
    },
    {
      quote: "The public status page really helps with customer transparency. The UI is also clean and professional.",
      author: "Maria Santos",
      role: "Product Manager",
      company: "SaaS Startup",
      rating: 5,
      avatar: "/professional-woman-avatar-2.png",
    },
  ]

  const useCases = [
    {
      title: "API Uptime Monitoring",
      description: "E-commerce platform monitors 50+ API endpoints with real-time response time tracking",
      industry: "E-commerce",
      color: "#00E5FF",
    },
    {
      title: "Cron Job Reliability",
      description: "Fintech startup uses heartbeat monitoring for billing and payment processing",
      industry: "Fintech",
      color: "#9B5CFF",
    },
    {
      title: "ETL Pipeline Monitoring",
      description: "Data company monitors nightly ETL jobs with escalation to on-call engineers",
      industry: "Data Analytics",
      color: "#14F195",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <section className="py-20 bg-gradient-to-b from-[#0B0F14] to-[#121A26]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
            <span className="text-gradient-purple">Testimonials & Use Cases</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto text-pretty">
            Trusted by engineering teams across various industries
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Testimonials Carousel */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 text-center lg:text-left">What they say?</h3>
            <div className="glassmorphism border border-white/10 relative overflow-hidden rounded-xl p-8 bg-card/50">
              <Quote className="w-8 h-8 text-[#00E5FF] mb-4" />
              <blockquote className="text-lg text-gray-300 mb-6 leading-relaxed">
                "{testimonials[currentIndex].quote}"
              </blockquote>
              <div className="flex items-center space-x-4">
                <img
                  src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                  alt={testimonials[currentIndex].author}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-white">{testimonials[currentIndex].author}</div>
                  <div className="text-sm text-gray-400">
                    {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                  </div>
                  <div className="flex mt-1">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#00E5FF] fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-[#00E5FF] w-8" : "bg-white/30"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 text-center lg:text-left">Real-world Use Cases</h3>
            <div className="space-y-6">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="glassmorphism border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl p-6 bg-card/50"
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: useCase.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">{useCase.title}</h4>
                        <Badge className="bg-white/10 text-gray-300 border-white/20 text-xs">{useCase.industry}</Badge>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{useCase.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
