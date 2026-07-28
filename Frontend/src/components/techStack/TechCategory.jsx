import TechnologyChip from "./TechnologyChip";

export default function TechCategory({
  title,
  technologies,
  color,
  bg,
  border,
}) {
  return (
    <div
      className={`
        rounded-3xl
        border
        ${border}
        bg-background/60
        backdrop-blur-xl
        p-7
        shadow-lg
        transition-all
        duration-300
        hover:shadow-2xl
      `}
    >
      {/* Category Heading */}
      <div className="mb-6 flex items-center gap-3">
        <div
          className={`
            h-4
            w-4
            rounded-full
            ${bg}
          `}
        />

        <h3
          className={`
            text-3xl
            font-bold
            ${color}
          `}
        >
          {title}
        </h3>
      </div>

      {/* Technologies */}
      <div className="space-y-4">
        {technologies.map((technology) => (
          <TechnologyChip
            key={technology.name}
            technology={technology}
            color={color}
            bg={bg}
            border={border}
          />
        ))}
      </div>
    </div>
  );
}