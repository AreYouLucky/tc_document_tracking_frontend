import React from "react";

interface BookingLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const BookingLayout: React.FC<BookingLayoutProps> = ({ children, className }) => {
  return (
    <div
      className={`relative min-h-screen py-10 w-full flex items-center justify-center print:hidden ${className}`}
      style={{
        backgroundImage: `url('/assets/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-linear-to-b from-yellow-500/90 to-orange-500/90"></div>
      <div className="relative z-10 flex flex-col min-h-screen w-full items-center">
        <section className="w-full max-w-4xl">
          <article className="aspect-video bg-white rounded-xl overflow-hidden flex items-center justify-center">
            Insert advertisement video here
          </article>
        </section>
        <header className="flex flex-col items-center justify-center pt-12 md:pt-20 text-center">
          <img src="/assets/tc-logo.png" alt="Logo" className="h-12 md:h-22 lg:h-24 mb-4" />
          <h1 className="text-white text-xl md:text-3xl font-extrabold inter-bold uppercase">
            Submit Request for Document
          </h1>
          <span className="text-md text-lg inter-semibold text-white">
            (Mag-request ug Dokumento)
          </span>
        </header>
        <main className="flex-1 w-full flex justify-center my-6 px-4 md:px-8 lg:px-16">
          <div className="w-full max-w-4xl space-y-6">
            <div className="w-full">
              {children}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default BookingLayout;
