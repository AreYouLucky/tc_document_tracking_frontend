import { FiCheckCircle, FiX } from "react-icons/fi";
import type { BudgetMonitoring } from "../../pages/booking/partials/booking-hooks";
import { Button } from "../button";
import Modal from "../modal";

type Props = {
    show: boolean;
    onClose: () => void;
    officeName: string;
    budgetMonitoring: BudgetMonitoring[];
};

const pesoFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

function CheckBalanceSuccess({
    show = false,
    onClose,
    officeName,
    budgetMonitoring,
}: Props) {

    return (
        <Modal show={show} onClose={onClose}>
            <div className="relative max-h-[85vh] overflow-hidden rounded-2xl border border-white/40 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.24)] print:hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.22),transparent_35%)]" />
                <div className="relative max-h-[85vh] overflow-y-auto px-6 pb-15 pt-10 md:px-15">
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

                        <div className="space-y-2 pt-3 pb-5">
                            <p className="inter-bold text-3xl text-slate-900">{officeName}</p>
                        </div>
                        {/* <div className="text-start w-full font-semibold uppercase">
                            Allotment Class
                        </div> */}

                        <div className="mt-5 w-full space-y-6 text-left">
                            {budgetMonitoring.map((budget) => (
                                <div
                                    key={budget.id}
                                    className=" border rounded-2xl border-orange-200 bg-white/95 px-10 py-8 "
                                >
                                    <div className="flex items-center gap-3">

                                        <div>
                                            <p className="inter-bold text-2xl text-slate-900">
                                                {budget.allotment_class.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className=" grid gap-3 md:grid-cols-2">
                                        <div className=" px-4 py-4">
                                            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                                                Appropriation
                                            </p>
                                            <p className="mt-2 inter-bold text-2xl text-orange-600">
                                                {pesoFormatter.format(Number(budget.appropriation))}
                                            </p>
                                        </div>
                                        <div className=" px-4 py-4">
                                            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                                                Allotment
                                            </p>
                                            <p className="mt-2 inter-bold text-2xl text-amber-600">
                                                {pesoFormatter.format(Number(budget.allotment))}
                                            </p>
                                        </div>
                                        <div className=" px-4 py-4">
                                            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                                                Obligation
                                            </p>
                                            <p className="mt-2 inter-bold text-2xl text-orange-600">
                                                {pesoFormatter.format(Number(budget.obligation))}
                                            </p>
                                        </div>
                                        <div className=" px-4 py-4">
                                            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                                                Unobligated Balance
                                            </p>
                                            <p className="mt-2 inter-bold text-2xl text-orange-600">
                                                {pesoFormatter.format(Number(budget.unobligated_balance))}
                                            </p>
                                        </div>
                                        <div className=" px-4 py-4 col-span-2">
                                            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                                                BUR(Obligation Based)*
                                            </p>
                                            <p className="mt-2 inter-bold text-2xl text-orange-600">
                                                {`${Number(budget.allotment) ? ((Number(budget.obligation) / Number(budget.allotment)) * 100).toFixed(2) : '0.00'}%`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {budgetMonitoring.length === 0 ? (
                                <div className="rounded-[1.6rem] border border-dashed border-orange-200 bg-white/90 px-6 py-8 text-center text-slate-500">
                                    No budget monitoring records found.
                                </div>
                            ) : null}
                        </div>

                        <div className="w-full">
                            <Button
                                onClick={onClose}
                                className="mt-7 h-14 w-full rounded-[1.25rem] bg-linear-to-r from-orange-500 to-amber-500 text-base text-white shadow-[0_14px_30px_rgba(234,88,12,0.25)] hover:from-orange-600 hover:to-amber-600"
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

export default CheckBalanceSuccess;
