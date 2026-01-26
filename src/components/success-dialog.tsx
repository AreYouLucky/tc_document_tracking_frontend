import { useEffect, useRef } from "react";
import { Button } from "./button";
import { IoCheckmarkOutline } from "react-icons/io5";
import Modal from "./modal";

type Props = {
  show: boolean;
  onClose: () => void;
};

function SuccessDialog({ show = false, onClose }: Props) {
  const countdownRef = useRef<HTMLSpanElement | null>(null);
  const timerRef = useRef<number| null>(null);

  useEffect(() => {
    if (!show) return;
    let seconds = 10;
    if (countdownRef.current) {
      countdownRef.current.textContent = `${seconds}s`;
    }

    timerRef.current = setInterval(() => {
      seconds--;

      if (countdownRef.current) {
        countdownRef.current.textContent = `${seconds}s`;
      }

      if (seconds === 0) {
        clearInterval(timerRef.current!);
        onClose();
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [show, onClose]);

  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex flex-col items-center text-center gap-1 max-w-md rounded-2xl px-5 relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
          <IoCheckmarkOutline className="text-orange-600 font-bold text-3xl" />
        </div>

        <p className="text-lg inter-semibold">
          Request Submitted Successfully!
        </p>

        <p className="text-[12px] text-gray-600 monst-regular">
          Your document request has been received. Please keep your request code
          for tracking and printing.
        </p>

        <Button
          onClick={onClose}
          className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-medium text-white hover:bg-orange-700 transition mt-2 inter-semibold"
        >
          Close (<span ref={countdownRef}>10s</span>)
        </Button>
      </div>
    </Modal>
  );
}

export default SuccessDialog;
