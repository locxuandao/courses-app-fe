export const LoginCard = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google`;
  };

  return (
    <div className="relative flex items-center justify-center p-10 px-12">
      <div className="pointer-events-none absolute inset-5 rounded-3xl border border-primary/18" />

      <div className="anim-up relative z-10 w-full max-w-90">
        <div className="mb-9">
          <p className="mb-2.5 text-[0.8rem] font-medium uppercase tracking-[0.12em] text-primary">
            Chào mừng bạn đến với Revise Hou
          </p>
          <h2 className="font-playfair text-[2rem] leading-tight text-text-primary">
            Đăng nhập
            <br />
            vào tài khoản
          </h2>
        </div>

        <div className="my-7 flex items-center gap-3.5">
          <div className="h-px flex-1 bg-text-primary/12" />
          <span className="whitespace-nowrap text-[0.78rem] text-text-secondary">
            Tiếp tục với
          </span>
          <div className="h-px flex-1 bg-text-primary/12" />
        </div>

        <button
          onClick={handleLogin}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-12 border-[1.5px] border-text-primary/15 bg-white py-3.75 px-6 font-sans text-[0.94rem] font-medium text-text-primary transition-all hover:border-primary/30 hover:bg-secondary/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Đăng nhập với HOU Gmail
        </button>

        <p className="mt-7 text-center text-[0.75rem] leading-[1.6] text-text-secondary">
          Bằng cách tiếp tục, bạn đồng ý với
          <br />
          <a
            href="#"
            className="underline decoration-text-secondary/30 transition-colors hover:text-primary hover:decoration-primary"
          >
            Điều khoản dịch vụ
          </a>{" "}
          và{" "}
          <a
            href="#"
            className="underline decoration-text-secondary/30 transition-colors hover:text-primary hover:decoration-primary"
          >
            Chính sách bảo mật
          </a>
          .
        </p>
      </div>

      <div className="pointer-events-none absolute right-13 bottom-9 select-none font-playfair text-[7rem] font-bold leading-none text-primary/5">
        Rh
      </div>
    </div>
  );
};
