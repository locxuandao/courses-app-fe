import { CheckCircle2 } from "lucide-react";

export const HeroSection = () => {
  const features = [
    "Lắp lại cách quãng dựa trên trí nhớ của bạn",
    "Flashcard thông minh tự thích nghi",
    "Theo dõi tiến độ học tập mỗi ngày",
  ];

  return (
    <div className="flex flex-col justify-between py-13 px-14 anim-left">
      <div className="flex items-center gap-3.5">
        <div className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[11px] bg-primary shadow-[0_4px_14px_rgba(0,124,195,.3)]">
          <div className="h-5 w-5 rotate-15 rounded-[4px] border-[2.5px] border-white/85" />
        </div>
        <span className="font-playfair text-[1.4rem] tracking-tight text-text-primary">
          Revise <span className="text-primary">Hou</span>
        </span>
      </div>

      <div className="max-w-[480px]">
        <h1 className="mb-5.5 font-playfair text-[clamp(2.4rem,4vw,3.4rem)] leading-[1.18] text-text-primary">
          Học lại,
          <br />
          nhớ <em className="italic text-primary">mãi mãi.</em>
        </h1>
        <p className="max-w-[380px] text-[0.98rem] leading-[1.7] text-text-secondary">
          Hệ thống ôn tập thông minh dành cho sinh viên Đại học Mở Hà Nội — giúp
          bạn ghi nhớ kiến thức bền vững, đơn giản và hiệu quả.
        </p>

        <div className="mt-10 flex flex-col gap-3.5">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 text-[0.88rem] text-text-secondary"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              {feature}
            </div>
          ))}
        </div>

        <div className="mt-10 inline-flex items-center gap-2.5 rounded-10 border border-primary/20 bg-primary/7 px-4 py-2.5">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-[0.8rem] font-medium text-primary">
            Dành cho sinh viên Đại học Mở Hà Nội
          </span>
        </div>
      </div>

      <div className="text-[0.78rem] text-text-secondary opacity-70">
        © 2026 Revise Hou. All rights reserved.
      </div>
    </div>
  );
};
