export default function UseCaseCard({
  icon,
  title,
  description,
  points,
  badge,
}) {
  return (
    <div
      className="
      group
      rounded-3xl
      border
      bg-background/40
      backdrop-blur-xl
      p-5
      transition-all
      duration-500
      hover:-translate-y-2
      hover:border-violet-500/40
      hover:shadow-[0_20px_80px_rgba(139,92,246,0.15)]
      "
    >
      <div
        className="
        mb-7
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-2xl
        bg-violet-500/10
        text-3xl
        transition-transform
        duration-500
        group-hover:scale-110
        group-hover:rotate-6
        "
      >
        {icon}
      </div>

      <h3 className="text-2xl font-bold">
        {title}
      </h3>

      <p className="mt-4 leading-8 text-muted-foreground text-1xl">
        {description}
      </p>

      <div className="my-5 h-px bg-border" />

      <div className="space-y-0">
        {points.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3"
          >
            <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />

            <span className="text-muted-foreground">
              {item}
            </span>
          </div>
        ))}
      </div>

      <div className="my-8 h-px bg-border" />

      <div className="flex items-center justify-between">

        <span className="text-sm text-muted-foreground">
          Perfect For
        </span>

        <div
          className="
          rounded-full
          bg-violet-500/10
          px-4
          py-2
          text-sm
          font-semibold
          text-violet-500
          "
        >
          {badge}
        </div>

      </div>
    </div>
  );
}