export default function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div
      className="
        group
        rounded-3xl
        border
        bg-background/40
        backdrop-blur-xl
        p-7
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-2xl
      "
    >
      <div className="mb-5 text-5xl">

        {icon}

      </div>

      <h3 className="text-xl font-bold">

        {title}

      </h3>

      <p className="mt-3 leading-7 text-muted-foreground">

        {description}

      </p>
    </div>
  );
}