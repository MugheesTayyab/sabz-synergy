const testimonials = [
  {
    quote: "Pehle bijli ka hisaab sirf andaza tha, ab sab kuch clear hai.",
    name: "Muhammad Rafiq",
    role: "Farmer",
    location: "Rahim Yar Khan",
    lang: "ur",
  },
  {
    quote: "Our school now runs 6 hours on solar with zero outages. The students can finally study without interruption.",
    name: "Principal Fatima",
    role: "Govt. School Administrator",
    location: "Swabi",
    lang: "en",
  },
  {
    quote: "The calculator saved us from buying the wrong system size. We would have wasted PKR 15 lakh.",
    name: "Imran Hussain",
    role: "Factory Owner",
    location: "Faisalabad",
    lang: "en",
  },
  {
    quote: "Hamari community ab 80 gharon ko bijli de rahi hai — sab kuch dashboard se monitor hota hai.",
    name: "Bibi Zainab",
    role: "Community Leader",
    location: "Tharparkar",
    lang: "ur",
  },
  {
    quote: "Finally an energy tool that speaks our language — both literally and in terms of our real challenges.",
    name: "Asad Khan",
    role: "NGO Project Manager",
    location: "Peshawar",
    lang: "en",
  },
  {
    quote: "ROI reporting in PKR helped us secure approval from the district board in one meeting.",
    name: "Saima Nawaz",
    role: "District Energy Officer",
    location: "Lahore",
    lang: "en",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-off-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-text-dark text-center mb-14">
          Voices From Across Pakistan
        </h2>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="break-inside-avoid bg-card-surface rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-sun-gold text-3xl font-[family-name:var(--font-display)] leading-none">
                &ldquo;
              </span>
              <p
                className={`text-text-dark text-sm leading-relaxed mb-4 ${
                  t.lang === "ur" ? "text-right" : ""
                }`}
                dir={t.lang === "ur" ? "rtl" : "ltr"}
                style={
                  t.lang === "ur"
                    ? { fontFamily: "Noto Nastaliq Urdu, serif" }
                    : {}
                }
              >
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest-green/10 flex items-center justify-center">
                  <span className="text-forest-green font-bold text-sm">
                    {t.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-dark">
                    {t.name}
                  </p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
                <span className="ml-auto bg-earth-terracotta/10 text-earth-terracotta text-[11px] px-2 py-0.5 rounded-full">
                  {t.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
