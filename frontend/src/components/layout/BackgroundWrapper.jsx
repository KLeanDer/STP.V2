import React from "react";

export default function BackgroundWrapper({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* === Тёплый народный градиент === */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#fefefe] via-[#f9f7f4] to-[#f2efe9] z-0"
        aria-hidden="true"
      >
        {/* Световые акценты */}
        <div className="absolute top-[-150px] left-[-100px] w-[600px] h-[600px] bg-amber-200/25 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[-80px] w-[500px] h-[500px] bg-orange-100/20 blur-[160px] rounded-full" />
        <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[800px] h-[300px] bg-yellow-100/15 blur-[140px] rounded-full" />
      </div>

      {/* === Центрированный STP, всегда в центре экрана === */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <h1
          className="text-[28rem] font-extrabold text-[#e8e2d8]/45 blur-[6px] rotate-[-25deg] tracking-tighter drop-shadow-[0_0_30px_rgba(253,186,116,0.15)]"
          style={{
            userSelect: "none",
            lineHeight: "0.7",
            transformOrigin: "center",
            willChange: "transform",
          }}
        >
          STP
        </h1>
      </div>

      {/* === Контент поверх === */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
