export default function DeveloperSkill({
  skill,
}) {
  return (
    <span
      className="
        rounded-full
        border
        border-violet-500/20
        bg-violet-500/10
        px-3
        py-1.5
        text-xs
        font-medium
        text-violet-400
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-violet-500/50
        hover:bg-violet-500/20
        hover:text-violet-300
      "
    >
      {skill}
    </span>
  );
}