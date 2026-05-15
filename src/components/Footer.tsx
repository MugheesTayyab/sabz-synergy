import { Sun } from "lucide-react";

const productLinks = ["Features", "Calculator", "Dashboard", "Pricing", "API Docs"];
const companyLinks = ["About", "Blog", "Careers", "Press", "Contact"];

export default function Footer() {
  return (
    <footer className="bg-bg-deep text-white relative">
      <div className="gold-divider" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sun className="w-6 h-6 text-sun-gold" />
              <span className="font-[family-name:var(--font-display)] text-lg font-bold">
                Sabz Synergy
              </span>
            </div>
            <p
              className="text-white/50 text-sm mb-5 leading-relaxed"
              dir="rtl"
              style={{ fontFamily: "Noto Nastaliq Urdu, serif" }}
            >
              بجلی سمجھو، مستقبل بناؤ
            </p>
            <div className="flex gap-3">
              {["X", "in", "YT", "WA"].map((s) => (
                <span
                  key={s}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/60 hover:bg-sun-gold/20 hover:text-sun-gold transition-colors cursor-pointer"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-white/80">Product</h4>
            <ul className="space-y-2.5">
              {productLinks.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-white/50 hover:text-sun-gold transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-white/80">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-white/50 hover:text-sun-gold transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-white/80">Pakistan Presence</h4>
            <div className="space-y-2.5 text-sm text-white/50">
              <p>HQ: Lahore, Punjab</p>
              <p>Support: +92 300 XXXXXXX</p>
              <p className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-surplus-green" />
                SECP Registered
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-bg-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>&copy; 2024 Sabz Synergy. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/60">Privacy Policy</a>
            <a href="#" className="hover:text-white/60">Terms of Service</a>
          </div>
          <p>Made with ☀️ in Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
