import { Star, Users, Zap } from "lucide-react"

export function SocialProof() {
  return (
    <section className="py-12 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12">
          {/* Trust Badge */}
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-[#00E5FF] fill-current" />
              ))}
            </div>
            <span className="text-gray-300">Trusted by engineering teams</span>
          </div>

          {/* Usage Stats */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#9B5CFF]" />
              <span className="text-gray-300">500+ developers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-[#14F195]" />
              <span className="text-gray-300">99.9% uptime</span>
            </div>
          </div>

          {/* Client Logos Placeholder */}
          {/* <div className="flex items-center space-x-6 opacity-60">
            <div className="w-20 h-8 glassmorphism rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">Client A</span>
            </div>
            <div className="w-20 h-8 glassmorphism rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">Client B</span>
            </div>
            <div className="w-20 h-8 glassmorphism rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">Client C</span>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}
