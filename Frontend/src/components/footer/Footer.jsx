import FooterCTA from "./FooterCTA";
import FooterBrand from "./FooterBrand";
import FooterLinks from "./FooterLinks";
import FooterBottom from "./FooterBottom";

export default function Footer() {
  return (
    <footer
      className="
        relative
        overflow-hidden
        border-t
        border-border/50
        bg-background
      "
    >
      {/* Background Glow */}

      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div
          className="
            absolute
            left-0
            top-40
            h-96
            w-96
            rounded-full
            bg-violet-500/10
            blur-[160px]
          "
        />

        <div
          className="
            absolute
            right-0
            bottom-0
            h-96
            w-96
            rounded-full
            bg-cyan-500/10
            blur-[170px]
          "
        />

      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

        {/* CTA */}

        <FooterCTA />

        {/* Main Footer */}

        <div
          className="
            mt-24
            grid
            gap-16
            lg:grid-cols-[1.1fr_0.9fr]
          "
        >

          {/* Brand */}

          <FooterBrand />

          {/* Links */}

          <FooterLinks />

        </div>

        {/* Bottom */}

        <FooterBottom />

      </div>
    </footer>
  );
}