import { FiAlertTriangle, FiRefreshCcw, FiX } from "react-icons/fi";
import { Button } from "../button";
import Modal from "../modal";

type Props = {
  show: boolean;
  onClose: () => void;
  onRetry: () => void;
  message?: string;
};

function CheckBalanceIncorrect({
  show = false,
  onClose,
  onRetry,
  message = "Incorrect PIN. Please try again.",
}: Props) {
  return (
    <Modal show={show} onClose={onClose}>
      <div className=" w-120 relative overflow-hidden rounded-2xl border border-white/40 bg-linear-to-br from-rose-50 via-white to-orange-100 shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
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
              <p className="inter-bold text-3xl text-slate-900">Incorrect PIN</p>
              <p className="rounded-full bg-rose-100 px-4 py-2 text-sm text-rose-700">
                Balance check failed
              </p>
            </div>

            <p className="mt-6 max-w-sm text-base leading-relaxed text-slate-600">
              {message}
            </p>

            <div className="mt-7 flex w-full flex-col gap-3">
              <Button
                onClick={onRetry}
                className="h-14 w-full rounded-[1.25rem] bg-linear-to-r from-rose-500 to-orange-500 text-base text-white shadow-[0_14px_30px_rgba(244,63,94,0.22)] hover:from-rose-600 hover:to-orange-600"
              >
                <FiRefreshCcw className="text-lg" />
                Try Again
              </Button>
              <Button
                onClick={onClose}
                className="h-14 w-full rounded-[1.25rem] border border-slate-300 bg-white text-base text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Close Dialog
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default CheckBalanceIncorrect;
