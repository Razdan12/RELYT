import { Button } from "@/components/ui/button"
import { Github, Twitter, Mail, FileText, Book, Activity, Shield, ExternalLink } from "lucide-react"
import logo from "@/assets/logo-reliability.png"

export function Footer() {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Demo", href: "#demo" },
      { name: "Changelog", href: "/changelog" },
    ],
    resources: [
      { name: "API Documentation", href: "/docs", icon: Book },
      { name: "Status Page", href: "/status", icon: Activity },
      { name: "Blog", href: "/blog", icon: FileText },
      { name: "Guides", href: "/guides", icon: Book },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Contact", href: "/contact" },
    ],
  }

  return (
    <footer className="bg-gradient-to-t from-[#0B0F14] to-[#121A26] border-t border-white/10">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <img src={logo} alt="Reliability Lite" className="w-42" />
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Simple, powerful, and reliable monitoring for all your digital services.
              </p>

             

              {/* Social Links */}
              <div className="flex space-x-4">
                <a
                  href="https://github.com/reliability-lite"
                  className="w-10 h-10 glassmorphism rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00E5FF]/30 transition-all"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/reliability_lite"
                  className="w-10 h-10 glassmorphism rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00E5FF]/30 transition-all"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="mailto:hello@reliability-lite.app"
                  className="w-10 h-10 glassmorphism rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00E5FF]/30 transition-all"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Product */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Product</h3>
                  <ul className="space-y-3">
                    {footerLinks.product.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-gray-400 hover:text-[#00E5FF] transition-colors">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Resources</h3>
                  <ul className="space-y-3">
                    {footerLinks.resources.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-[#00E5FF] transition-colors flex items-center"
                        >
                          {link.icon && <link.icon className="w-4 h-4 mr-2" />}
                          {link.name}
                          <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Company</h3>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-gray-400 hover:text-[#00E5FF] transition-colors">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-12 border-t border-white/10">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready for monitoring without drama?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join 500+ developers who already trust Reliability Lite to keep their services online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-black font-semibold rounded-2xl px-8 glow-cyan">
                Start Free Now
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-8 bg-transparent"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">© 2025 Reliability Lite. All rights reserved.</div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-[#14F195]" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-[#00E5FF]" />
                <span>99.9% Uptime SLA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
