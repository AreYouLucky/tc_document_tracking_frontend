import { useEffect, useRef } from "react";
import { Button } from "./button";
import { BiSolidError } from "react-icons/bi";
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
            <div className="flex flex-col items-center text-center gap-5 max-w-md mx-auto rounded-3xl p-6 bg-linear-to-br from-red-50 to-red-100 shadow-2xl relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-tr from-red-400 to-red-600 shadow-lg animate-pulse">
                    <BiSolidError className="text-white text-5xl font-bold" />
                </div>
                <p className="text-2xl font-extrabold text-red-700 inter-bold">
                    Unexpected Error!
                </p>
                <p className="text-sm text-gray-600 mt-1 monst-regular">
                    Please contact the systems administrator. Something went wrong.
                </p>
                <Button
                    onClick={onClose}
                    className="mt-2 w-full rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700 transition-transform transform hover:scale-105"
                >
                    Close (<span ref={countdownRef}>10s</span>)
                </Button>
            </div>

        </Modal>
    );
}

export default ErrorDialog;
