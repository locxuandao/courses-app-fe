interface Props {
  title: string;
  description: string;
  createdAt: string;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const SubjectItem = (props: Props) => {
  const { title, description, createdAt } = props;
  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-primary/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md hover:shadow-primary/10 cursor-pointer overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
        </div>
        <h3 className="flex-1 pt-1 text-sm font-semibold leading-snug text-text-primary line-clamp-2">
          {title}
        </h3>
      </div>
      <p className="text-xs leading-relaxed text-text-secondary line-clamp-2">
        {description}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-primary/8 pt-3">
        <span className="text-[11px] text-text-secondary/60">
          {formatDate(createdAt)}
        </span>
        <span className="flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Xem chi tiết
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SubjectItem;
