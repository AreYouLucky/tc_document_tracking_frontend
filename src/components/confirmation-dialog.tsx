import { Button } from "./button";
import { FiArrowRight, FiCheckCircle, FiX } from "react-icons/fi";
import Modal from "./modal";

type Props = {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
};

function ConfirmationDialog({
    show = false,
    onClose,
    onConfirm,
    loading = false,
}: Props) {
    return (
        <Modal show={show} onClose={()=>{}}>
            <div className="w-150 relative overflow-hidden rounded-2xl border border-white/40 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.24)] print:hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.2),transparent_35%)]" />
                <div className="relative px-6 pb-7 pt-5 md:px-10">
                    <div className="mx-auto mb-5 h-1.5 w-24 rounded-full bg-orange-200" />

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-orange-200 bg-white/90 text-orange-500 shadow-sm transition hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <FiX className="text-xl" />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-linear-to-br from-orange-500 to-amber-500 text-white shadow-[0_18px_35px_rgba(234,88,12,0.28)]">
                            <FiCheckCircle className="text-5xl" />
                        </div>

                        <div className="space-y-2 my-4">
                            <h2 className="inter-bold text-4xl text-slate-900">
                                Confirm Request
                            </h2>
                        </div>

                        <div className="mt-7 flex w-full flex-col-reverse gap-3 sm:flex-row">
                            <Button
                                onClick={onClose}
                                disabled={loading}
                                className="h-14 flex-1 rounded-[1.25rem] border-2 border-slate-200 bg-white text-base text-slate-700 shadow-sm hover:bg-slate-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={onConfirm}
                                disabled={loading}
                                className="h-14 flex-1 rounded-[1.25rem] bg-orange-500 text-base text-white shadow-[0_14px_30px_rgba(234,88,12,0.25)] hover:from-orange-600 hover:to-amber-600"
                            >
                                {loading ? "Processing..." : "Submit Request"}
                                {!loading && <FiArrowRight className="text-lg" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ConfirmationDialog;
