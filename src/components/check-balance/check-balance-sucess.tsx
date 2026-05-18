import { useEffect, useMemo, useState } from "react";
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
    const [activeBudgetId, setActiveBudgetId] = useState<number | null>(null);

    const activeBudget = useMemo<BudgetMonitoring | null>(() => {
        if (budgetMonitoring.length === 0) {
            return null;
        }

        return budgetMonitoring.find((budget) => budget.id === activeBudgetId) ?? budgetMonitoring[0] ?? null;
    }, [activeBudgetId, budgetMonitoring]);

    useEffect(() => {
        if (!show) {
            return;
        }

        setActiveBudgetId((currentBudgetId) => {
            const hasCurrentBudget = budgetMonitoring.some((budget) => budget.id === currentBudgetId);

            if (hasCurrentBudget) {
                return currentBudgetId;
            }

            return budgetMonitoring[0]?.id ?? null;
        });
    }, [budgetMonitoring, show]);

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

                        <div className="mt-5 w-full space-y-5 text-left">
                            {budgetMonitoring.length === 0 ? (
                                <div className="rounded-[1.6rem] border border-dashed border-orange-200 bg-white/90 px-6 py-8 text-center text-slate-500">
                                    No budget monitoring records found.
                                </div>
                            ) : null}

                            {budgetMonitoring.length > 0 ? (
                                <div className="rounded-2xl border border-orange-200 bg-white/95 px-5 py-5 shadow-sm md:px-7 md:py-6">
                                    <div
                                        role="tablist"
                                        aria-label="Allotment classes"
                                        className="flex gap-2 overflow-x-auto border-b border-orange-100 pb-5 pt-1 px-1 justify-center"
                                    >
                                        {budgetMonitoring.map((budget) => {
                                            const isActive = activeBudget?.id === budget.id;

                                            return (
                                                <button
                                                    key={budget.id}
                                                    type="button"
                                                    role="tab"
                                                    aria-selected={isActive}
                                                    aria-controls={`budget-panel-${budget.id}`}
                                                    id={`budget-tab-${budget.id}`}
                                                    onClick={() => setActiveBudgetId(budget.id)}
                                                    className={`shrink-0 rounded-full border px-5 py-2.5 text-base font-bold transition focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${isActive
                                                        ? "border-orange-500 bg-orange-500 text-white shadow-sm"
                                                        : "border-orange-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50"
                                                        }`}
                                                >
                                                    {budget.allotment_class.name}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {activeBudget ? (
                                        <div
                                            role="tabpanel"
                                            id={`budget-panel-${activeBudget.id}`}
                                            aria-labelledby={`budget-tab-${activeBudget.id}`}
                                            className="pt-6"
                                        >
                                            <div className="mb-2 flex items-center gap-3">
                                                <p className="inter-bold text-2xl text-slate-900">
                                                    {activeBudget.allotment_class.name}
                                                </p>
                                            </div>

                                            <div className="grid gap-3 md:grid-cols-2">
                                                <div className="px-4 py-4">
                                                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                                                        Appropriation
                                                    </p>
                                                    <p className="mt-2 inter-bold text-2xl text-orange-600">
                                                        {pesoFormatter.format(Number(activeBudget.appropriation))}
                                                    </p>
                                                </div>
                                                <div className="px-4 py-4">
                                                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                                                        Allotment
                                                    </p>
                                                    <p className="mt-2 inter-bold text-2xl text-amber-600">
                                                        {pesoFormatter.format(Number(activeBudget.allotment))}
                                                    </p>
                                                </div>
                                                <div className="px-4 py-4">
                                                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                                                        Obligation
                                                    </p>
                                                    <p className="mt-2 inter-bold text-2xl text-orange-600">
                                                        {pesoFormatter.format(Number(activeBudget.obligation))}
                                                    </p>
                                                </div>
                                                <div className="px-4 py-4">
                                                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                                                        Unobligated Balance
                                                    </p>
                                                    <p className="mt-2 inter-bold text-2xl text-orange-600">
                                                        {pesoFormatter.format(Number(activeBudget.unobligated_balance))}
                                                    </p>
                                                </div>
                                                <div className="px-4 py-4 md:col-span-2">
                                                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                                                        BUR(Obligation Based)*
                                                    </p>
                                                    <p className="mt-2 inter-bold text-2xl text-orange-600">
                                                        {`${Number(activeBudget.allotment) ? ((Number(activeBudget.obligation) / Number(activeBudget.allotment)) * 100).toFixed(2) : "0.00"}%`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
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
