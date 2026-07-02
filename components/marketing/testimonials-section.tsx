"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionWrapper } from "./section-wrapper";

const testimonials = [
  {
    name: "Ammar Jaffri",
    role: "FinTech Founder",
    text: "The delivery of our client billing system was faster than expected. Antigravity's code architecture is incredibly clean.",
    rating: 5,
  },
  {
    name: "Sarah Ahmed",
    role: "SaaS Builder",
    text: "We completely migrated our workspace toolset to Zorvate. The project dashboards are state-of-the-art and easy to scale.",
    rating: 5,
  },
  {
    name: "Zainab Malik",
    role: "Product Director",
    text: "Performance, type-safety, and UX design are premium. They took complete ownership of our tech stack launch.",
    rating: 5,
  },
  {
    name: "Usman Raza",
    role: "E-commerce COO",
    text: "The real-time workspace portal made tracking milestones extremely easy. Absolute professionals throughout.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  // Duplicate list to achieve seamless loop
  const scrollList = [...testimonials, ...testimonials];

  return (
    <SectionWrapper className="border-t bg-background relative overflow-hidden py-24">
      {/* CSS Marquee Keyframes Block */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full"
          >
            Client Reviews
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-foreground"
          >
            Trusted by Builders
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-muted-foreground text-base leading-relaxed"
          >
            Read reviews from startup founders and development leaders working with us.
          </motion.p>
        </div>

        {/* Marquee viewport */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] py-4">
          <div className="animate-marquee gap-6">
            {scrollList.map((t, i) => (
              <div
                key={i}
                className="w-[300px] sm:w-[360px] p-6 rounded-2xl border bg-background/50 backdrop-blur-md glass-panel flex flex-col justify-between shrink-0 hover:border-primary/20 transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, rIdx) => (
                        <Star key={rIdx} size={14} className="fill-primary text-primary" />
                      ))}
                    </div>
                    <Quote size={20} className="text-muted/40" />
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                    “{t.text}”
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}