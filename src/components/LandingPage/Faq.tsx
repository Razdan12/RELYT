import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "What's the difference between HTTP checks and Heartbeat checks?",
      answer:
        "HTTP checks monitor endpoints by sending periodic requests and checking response codes/times. Heartbeat checks wait for signals from your application - if no signal is received within a certain time, we consider it a problem. HTTP is for monitoring websites/APIs, Heartbeat is for cron jobs/background tasks.",
    },
    {
      question: "Can heartbeat tokens expire?",
      answer:
        "Heartbeat tokens use secure hashing and don't have expiry dates. Tokens can only be used for specific heartbeat endpoints and don't contain sensitive information. You can regenerate tokens anytime from the dashboard.",
    },
    {
      question: "Is Reliability Lite multi-tenant?",
      answer:
        "Yes, each user has a separate workspace with full data isolation. You can create multiple projects within one account and invite team members with role-based access control.",
    },
    {
      question: "What are Quiet Hours and Escalation?",
      answer:
        "Quiet Hours allow you to disable notifications during certain hours (e.g., nighttime). Escalation is a tiered system - if an incident isn't acknowledged within a certain time, notifications are sent to the next level (e.g., from developer to manager).",
    },
    {
      question: "How does the public status page work?",
      answer:
        "The status page is a public page that displays real-time status of all your services. Customers can view uptime history, incident timelines, and subscribe for updates. You can customize the domain and branding as needed.",
    },
    {
      question: "Is there an API for custom integrations?",
      answer:
        "Yes, we provide a complete REST API for managing checks, incidents, and notifications. API documentation is available at docs.reliability-lite.app with code examples for various programming languages.",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
            <span className="text-gradient-cyan">Frequently Asked Questions</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto text-pretty">Common questions about Reliability Lite</p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glassmorphism border-white/10 rounded-2xl px-6 data-[state=open]:border-[#00E5FF]/30"
              >
                <AccordionTrigger className="text-left text-white hover:text-[#00E5FF] transition-colors py-6 text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-6 leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <a
            href="mailto:support@reliability-lite.app"
            className="text-[#00E5FF] hover:text-[#00E5FF]/80 transition-colors font-semibold"
          >
            Contact our support team →
          </a>
        </div>
      </div>
    </section>
  )
}
