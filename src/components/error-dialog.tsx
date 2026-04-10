import { useEffect, useRef } from "react";
import { Button } from "./button";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import Modal from "./modal";

type Props = {
    show: boolean;
    onClose: () => void;
};

function ErrorDialog({ show = false, onClose }: Props) {
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
            <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-linear-to-br from-rose-50 via-white to-orange-100 shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.88),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.16),transparent_35%)]" />
                <div className="relative px-6 pb-7 pt-5 md:px-7">
                    <div className="mx-auto mb-5 h-1.5 w-24 rounded-full bg-rose-200" />

                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-rose-200 bg-white/90 text-rose-500 shadow-sm transition hover:bg-rose-50 hover:text-rose-600"
                    >
                        <FiX className="text-xl" />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-linear-to-br from-rose-500 to-orange-500 text-white shadow-[0_18px_35px_rgba(244,63,94,0.24)]">
                            <FiAlertTriangle className="text-5xl" />
                        </div>

                        <div className="space-y-2">
                            <p className="inter-bold text-3xl text-slate-900">
                                Submission Failed
                            </p>
                            <p className="rounded-full bg-rose-100 px-4 py-2 text-sm text-rose-700">
                                Please review and try again
                            </p>
                        </div>

                        <p className="mt-6 max-w-sm text-base leading-relaxed text-slate-600">
                            Something went wrong while sending your request. If this keeps happening, please contact the system administrator.
                        </p>

                        <Button
                            onClick={onClose}
                            className="mt-7 h-14 w-full rounded-[1.25rem] bg-linear-to-r from-rose-500 to-orange-500 text-base text-white shadow-[0_14px_30px_rgba(244,63,94,0.22)] hover:from-rose-600 hover:to-orange-600"
                        >
                            Close Dialog (<span ref={countdownRef}>20s</span>)
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ErrorDialog;
