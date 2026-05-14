import React, { useState, useEffect } from "react";
import { VerseCarousel } from "../components/verses-carousel";
import { verses } from "../defaults/data";
import { IdleOverlay } from "../components/idle-components/idle-overlay";
import { useIdle } from "../components/idle-components/idle-hooks";
interface BookingLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const BookingLayout: React.FC<BookingLayoutProps> = ({ children, className }) => {
  // const isIdle = useIdle(30000);
  const isIdle = useIdle(5000000000000000000000000000); 
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (isIdle) {
      //setShowOverlay(true);
    }
  }, [isIdle]);

  const handleClose = () => {
    setShowOverlay(false);
  };
  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden py-10 print:hidden md:py-14 ${className}`}
      style={{
        backgroundImage: `url('/assets/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
       <IdleOverlay visible={showOverlay} onClose={handleClose} />
      <div className="absolute inset-0 bg-linear-to-br from-yellow-500/85 via-orange-500/88 to-amber-700/88"></div>
      <div className="relative z-10 flex w-full flex-col items-center min-h-screen justify-center">
        <div className="grid w-full">
          <header className="flex flex-col items-center justify-center px-4 pt-8 text-center md:py-4">
            <div className=" px-5 ">
              <img src="/assets/tc-logo.png" alt="Logo" className="mx-auto mb-4 h-14 md:h-20 lg:h-40" />
            </div>
            <VerseCarousel verses={verses} interval={10000} />

          </header>
          <main className="mb-6 flex w-full flex-1 justify-center px-4 md:px-8 lg:px-13">
            <div className="w-full max-w-5xl space-y-6">
              <div className="w-full">
                {children}
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BookingLayout;
