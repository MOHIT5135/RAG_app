export default function SocialIcon({
  icon: Icon,
  href,
  label,
}) {
  return (
    <a
      href={href}
      target={
        href.startsWith("http")
          ? "_blank"
          : "_self"
      }
      rel={
        href.startsWith("http")
          ? "noopener noreferrer"
          : undefined
      }
      aria-label={label}
      className="
        group
        relative
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-2xl
        border
        border-border
        bg-background/60
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-violet-500/50
        hover:bg-violet-500/10
        hover:shadow-lg
        hover:shadow-violet-500/20
      "
    >
      {/* Icon */}

      <Icon
        className="
          h-5
          w-5
          text-muted-foreground
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:text-violet-400
        "
      />

      {/* Tooltip */}

      <span
        className="
          pointer-events-none
          absolute
          -top-11
          left-1/2
          -translate-x-1/2
          whitespace-nowrap
          rounded-lg
          bg-foreground
          px-3
          py-1.5
          text-xs
          font-medium
          text-background
          opacity-0
          shadow-xl
          transition-all
          duration-300
          group-hover:-translate-y-1
          group-hover:opacity-100
        "
      >
        {label}
      </span>
    </a>
  );
}