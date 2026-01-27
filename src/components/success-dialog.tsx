import { useEffect, useRef } from "react";
import { Button } from "./button";
import { IoCheckmarkOutline } from "react-icons/io5";
import Modal from "./modal";

type Props = {
    show: boolean;
    onClose: () => void;
    code: string | null;
};

function SuccessDialog({ show = false, onClose, code }: Props) {
    const countdownRef = useRef<HTMLSpanElement | null>(null);
    const timerRef = useRef<number | null>(null);

      useEffect(() => {
        if (!show) return;
        let seconds = 20;
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
            <div className="flex flex-col items-center text-center gap-5 max-w-md rounded-3xl p-6 bg-linear-to-br from-orange-50 to-orange-100 shadow-2xl print:hidden ">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-tr from-orange-400 to-orange-600 shadow-lg animate-pulse">
                    <IoCheckmarkOutline className="text-white text-5xl font-bold" />
                </div>
                <p className="text-2xl font-extrabold text-orange-700 inter-bold">
                    Request Submitted!
                </p>
                <div className="bg-white rounded-xl px-6 py-3 w-full shadow-md">
                    <p className="text-xl font-bold text-orange-600 tracking-wider inter-bold">
                        {code}
                    </p>
                </div>
                <p className="text-sm text-gray-600 mt-1 monst-regular">
                    Your document request has been received. Keep your request code handy for tracking or printing.
                </p>
                <Button
                    onClick={onClose}
                    className="mt-4 w-full rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white hover:bg-orange-700 transition-transform transform hover:scale-105"
                >
                    Close (<span ref={countdownRef}>10s</span>)
                </Button>
            </div>


        </Modal>
    );
}

export default SuccessDialog;
