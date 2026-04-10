import { useEffect, useRef } from "react";
import { Button } from "./button";
import { FiCheckCircle, FiX } from "react-icons/fi";
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
            <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-linear-to-br from-orange-50 via-white to-amber-100 shadow-[0_24px_70px_rgba(15,23,42,0.24)] print:hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.22),transparent_35%)]" />
                <div className="relative px-6 pb-7 pt-5 md:px-7">
                    <div className="mx-auto mb-5 h-1.5 w-24 rounded-full bg-orange-200" />

                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-orange-200 bg-white/90 text-orange-500 shadow-sm transition hover:bg-orange-50 hover:text-orange-600"
                    >
                        <FiX className="text-xl" />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-linear-to-br from-orange-500 to-amber-500 text-white shadow-[0_18px_35px_rgba(234,88,12,0.28)]">
                            <FiCheckCircle className="text-5xl" />
                        </div>

                        <div className="space-y-2">
                            <p className="inter-bold text-3xl text-slate-900">
                                Request Submitted
                            </p>
                            <p className="rounded-full bg-orange-100 px-4 py-2 text-sm text-orange-700">
                                Save this code for tracking
                            </p>
                        </div>

                        <div className="mt-6 w-full rounded-[1.6rem] border border-orange-200 bg-white/90 px-6 py-5 shadow-[0_12px_28px_rgba(148,163,184,0.14)]">
                            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                                Request Code
                            </p>
                            <p className="inter-bold mt-2 text-3xl tracking-[0.18em] text-orange-600 md:text-4xl">
                                {code}
                            </p>
                        </div>

                        <p className="mt-5 max-w-sm text-base leading-relaxed text-slate-600">
                            Your document request has been received. Keep this request code handy for printing or status checking.
                        </p>

                        <Button
                            onClick={onClose}
                            className="mt-7 h-14 w-full rounded-[1.25rem] bg-linear-to-r from-orange-500 to-amber-500 text-base text-white shadow-[0_14px_30px_rgba(234,88,12,0.25)] hover:from-orange-600 hover:to-amber-600"
                        >
                            Close Dialog (<span ref={countdownRef}>20s</span>)
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default SuccessDialog;
