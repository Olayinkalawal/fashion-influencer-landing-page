"use client";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center px-4">
        <div className="animation-delay-8 animate-fadeIn mt-32 flex flex-col items-center justify-center px-4 text-center md:mt-32">
          <div className="mb-10 mt-4 md:mt-6">
            <div className="px-2">
              <div className="relative mx-auto h-full max-w-7xl p-6 md:px-12 md:py-20">
                <h1 className="flex select-none flex-col px-3 py-2 text-center text-5xl font-semibold leading-none tracking-tight md:flex-col md:text-8xl lg:flex-row lg:text-8xl">
                  <span className="text-primary absolute -left-5 -top-5 h-10 w-10">✨</span>
                  <span className="text-primary absolute -bottom-5 -left-5 h-10 w-10">✨</span>
                  <span className="text-primary absolute -right-5 -top-5 h-10 w-10">✨</span>
                  <span className="text-primary absolute -bottom-5 -right-5 h-10 w-10">✨</span>
                  Fashion Influencer & Style Guide
                </h1>
                <div className="flex items-center justify-center gap-2 mt-6">
                  <div className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex h-full w-full rounded-full bg-green-500"></span>
                  </div>
                  <p className="text-medium text-green-500">Available for Collaborations</p>
                </div>
              </div>
            </div>

            <h1 className="mt-8 text-2xl md:text-2xl">
              Welcome to my fashion journey! I&#39;m{" "}
              <span className="text-primary font-bold">Jariatu Danita</span>
            </h1>

            <p className="md:text-md mx-auto mb-16 mt-4 max-w-2xl px-6 text-sm text-primary/60 sm:px-6 md:max-w-4xl md:px-20 lg:text-lg">
              I showcase the latest fashion trends, share style tips, and collaborate with leading brands
              to bring you the best in fashion and lifestyle content.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 