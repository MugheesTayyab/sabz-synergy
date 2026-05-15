"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    sub: "Forever free",
    features: [
      "Up to 1 site",
      "Microgrid calculator",
      "Basic dashboard (30-day data)",
      "English only",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Saathi Pro",
    price: "PKR 4,999",
    sub: "/month",
    features: [
      "Up to 5 sites",
      "Live energy tracking",
      "AI forecasting (72 hours)",
      "Urdu + English",
      "PKR ROI reports",
      "Islamic financing calculator",
      "Priority support",
    ],
    cta: "Start 14-Day Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    sub: "PKR pricing",
    features: [
      "Unlimited sites",
      "Custom dashboards for DISCOs / govt",
      "API access",
      "Dedicated account manager",
      "White-label option",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes — upgrade, downgrade, or cancel at any time. No lock-in contracts.",
  },
  {
    q: "Is there a free trial for Saathi Pro?",
    a: "Absolutely. 14 days free, no credit card required. Full feature access.",
  },
  {
    q: "Do you support Islamic financing?",
    a: "All plans are available with Shariah-compliant financing structures through our partner Meezan Bank.",
  },
  {
    q: "What payment methods do you accept?",
    a: "JazzCash, EasyPaisa, bank transfer, and all major debit/credit cards. All in PKR.",
  },
  {
    q: "Can I get a custom quote for my organization?",
    a: "Yes — contact our sales team for Enterprise pricing tailored to your specific needs.",
  },
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="pricing" className="py-24 px-6 bg-card-surface">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-text-dark text-center mb-3">
          Simple, Fair Pricing — In PKR
        </h2>
        <p className="text-text-muted text-center mb-14">
          Start free, upgrade when you grow
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl p-7 transition-all hover:-translate-y-1 ${
                p.highlighted
                  ? "bg-forest-green text-white shadow-xl scale-[1.02]"
                  : "bg-card-surface border border-warm-sand shadow-sm"
              }`}
            >
              <h3
                className={`font-semibold text-lg mb-1 ${
                  p.highlighted ? "text-white" : "text-text-dark"
                }`}
              >
                {p.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span
                  className={`font-[family-name:var(--font-mono)] text-3xl font-bold ${
                    p.highlighted ? "text-sun-gold" : "text-text-dark"
                  }`}
                >
                  {p.price}
                </span>
                <span
                  className={`text-sm ${
                    p.highlighted ? "text-white/60" : "text-text-muted"
                  }`}
                >
                  {p.sub}
                </span>
              </div>
              <ul className="space-y-3 mb-7">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        p.highlighted ? "text-sun-gold" : "text-forest-green"
                      }`}
                    />
                    <span className={p.highlighted ? "text-white/90" : "text-text-mid"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] ${
                  p.highlighted
                    ? "bg-sun-gold text-bg-deep"
                    : "bg-forest-green text-white"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-forest-green/5 rounded-lg p-4 text-center text-sm text-forest-green mb-14">
          All plans available with Shariah-compliant financing structures
        </div>

        <div className="max-w-2xl mx-auto">
          <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-dark text-center mb-6">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-off-white rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-text-dark">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-text-muted transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-text-mid">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
