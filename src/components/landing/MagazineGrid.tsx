"use client";

import Image from "next/image";

export default function MagazineGrid() {
  return (
    <div className="relative w-full min-h-screen bg-white" style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}>
      {/* 
        TYPOGRAPHY OVERLAY 
        Changed from fixed back to absolute so it scrolls naturally with the container
      */}
      <div className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center text-white mix-blend-difference overflow-hidden">
        {/* Main Title */}
        <h1 className="text-[25vw] sm:text-[22vw] md:text-[20vw] font-black leading-[0.85] tracking-tighter uppercase text-center flex flex-col items-center pt-24">
          <span>ALL</span>
          <span>BLUE</span>
        </h1>

        {/* Slogan Text: Ultra-Tight Constraint for Narrow Gap */}
        <div className="mt-20 md:mt-32 flex flex-col w-[20vw] min-w-[120px] max-w-[300px]">
          <div className="text-sm sm:text-base md:text-[22px] font-black tracking-tighter leading-none uppercase text-left opacity-90">Mix Malls</div>
          <div className="text-sm sm:text-base md:text-[22px] font-black tracking-tighter leading-none uppercase text-right mt-1 opacity-90">Match Your Style</div>
        </div>
      </div>

      {/* IMAGE GRID */}
      <main className="relative z-10 w-full max-w-[1600px] mx-auto min-h-screen flex flex-col justify-between pt-10 md:pt-20 px-4 md:px-8 pb-8 gap-4">

        {/* Top 2 Large Images */}
        <div className="grid grid-cols-2 gap-4 md:gap-12 w-full max-w-5xl mx-auto flex-1">
          {/* Left Model */}
          <div className="relative w-full bg-zinc-100 overflow-hidden aspect-4/5 object-top">
            <Image
              src="/images/look_top_1.png"
              alt="Male model with bag"
              fill
              className="object-cover object-top grayscale"
              priority
            />
          </div>
          {/* Right Model */}
          <div className="relative w-full bg-zinc-100 overflow-hidden aspect-4/5 object-top">
            <Image
              src="/images/look_top_2.png"
              alt="Female model with accessory"
              fill
              className="object-cover object-top grayscale"
              priority
            />
          </div>
        </div>

        {/* Bottom 5 Small Images */}
        <div className="grid grid-cols-5 gap-2 md:gap-4 w-full h-[25vh] md:h-[35vh] mt-8">
          <div className="relative w-full h-full bg-zinc-100 overflow-hidden">
            <Image
              src="/images/look_bottom_1.png"
              alt="Look 1"
              fill
              className="object-cover grayscale"
            />
          </div>
          <div className="relative w-full h-full bg-zinc-100 overflow-hidden">
            <Image
              src="/images/look_bottom_2.png"
              alt="Look 2"
              fill
              className="object-cover grayscale object-top"
            />
          </div>
          <div className="relative w-full h-full overflow-hidden opacity-0" />
          <div className="relative w-full h-full bg-zinc-100 overflow-hidden">
            <Image
              src="/images/look_bottom_4.png"
              alt="Look 4"
              fill
              className="object-cover grayscale"
            />
          </div>
          <div className="relative w-full h-full bg-zinc-100 overflow-hidden">
            <Image
              src="/images/look_bottom_5.png"
              alt="Look 5"
              fill
              className="object-cover grayscale object-top"
            />
          </div>
        </div>

      </main>
    </div>
  );
}
