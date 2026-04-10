import { useState } from "react";
import { FiArrowRightCircle, FiFileText, FiLoader } from "react-icons/fi";
import BookingDetailsDialog from "../../components/booking-details-dialog";
import PrintCode from "../../components/print-code";
import ErrorDialog from "../../components/error-dialog";
import InputError from "../../components/input-error";
import SuccessDialog from "../../components/success-dialog";
import BookingLayout from "../../layouts/booking-layout";
import type { ServicesModel } from "../../types/models";
import { useHandleChange } from "../../utils/utilities";
import { type FormValueTypes, useCreateBooking, useFetchServices } from "./partials/booking-hooks";
import HeaderInfo from "./partials/header-info";
import ConfirmationDialog from "../../components/confirmation-dialog";

export default function DocumentBooking() {
    const { data: services, isFetching } = useFetchServices();
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [printData, setPrintData] = useState<{
        code: string;
    } | null>(null);

    const { item, setItem, handleChange, errors, setErrors } = useHandleChange<FormValueTypes>({
        client_name: "",
        requesting_office: "",
        service_id: null,
        queue_number: "",
        currentDate: "",
    });

    const selectedService = services?.find((service) => service.id === item.service_id);
    const createBooking = useCreateBooking();

    const getErrorMessage = (value: unknown) => {
        if (Array.isArray(value)) return value[0] ?? "";
        return typeof value === "string" ? value : "";
    };

    const handleServiceSelect = (serviceId: number) => {
        setItem((prev) => ({
            ...prev,
            service_id: serviceId,
        }));
        setErrors((prev) => ({
            ...prev,
            service_id: undefined,
        }));
        setShowDetailsDialog(true);
    };

    const handleDetailsContinue = () => {
        const nextErrors: Partial<Record<keyof FormValueTypes, string>> = {};

        if (!item.client_name?.trim()) {
            nextErrors.client_name = "Please enter your full name.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors((prev) => ({
                ...prev,
                ...nextErrors,
            }));
            return;
        }

        setShowDetailsDialog(false);
        setShowConfirmation(true)
    };

    const createBookingFn = () => {
        setShowConfirmation(false);
        const formData = new FormData();
        formData.append("client_name", item.client_name!);
        formData.append("requesting_office", item.requesting_office!);
        formData.append("service_id", String(item.service_id!));

        createBooking.mutate(formData, {
            onSuccess: (data) => {
                setShowSuccessDialog(true);
                if (data) {
                    setItem({
                        ...item,
                        queue_number: data.data?.queue_number ?? "",
                    });
                    setPrintData({
                        code: data?.data?.queue_number ?? "",
                    });
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            window.print();
                        });
                    });
                }
            },
            onError: (error) => {
                if (error.response?.data?.errors) {
                    setErrors(error.response?.data.errors ?? {});
                }
                setShowErrorDialog(true);
            },
        });
    };


    const closeSuccessDialog = () => {
        setShowSuccessDialog(false);
        setItem({
            client_name: "",
            requesting_office: "",
            service_id: null,
            queue_number: "",
        });
        createBooking.reset();
    };

    const isSubmitDisabled =
        !item.client_name?.trim() || !item.service_id || isFetching || createBooking.isPending;

    return (
        <>
            <BookingLayout>
                <section className="print:hidden">
                    <div className="kiosk-rise relative overflow-hidden rounded-[2.25rem] border border-white/20  shadow-[0_24px_80px_rgba(15,23,42,0.18)] ">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(253,186,116,0.26),transparent_30%)]" />
                        <div className="relative rounded-[1.75rem] bg-linear-to-br from-orange-50 via-white to-amber-100 p-5 md:p-8">

                            <div className="space-y-6">
                                <HeaderInfo />

                                <div className="space-y-4 mt-10 px-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="inter-bold text-2xl text-slate-900 md:text-3xl">Choose a Document</p>
                                            <p className="mt-1 text-base text-slate-600 md:text-lg">
                                                Pilia ang dokumento nga imong kinahanglan
                                            </p>
                                        </div>
                                        <div className="rounded-full bg-orange-100 px-4 py-2 text-sm text-orange-700 md:text-base">
                                            Tap to select
                                        </div>
                                    </div>

                                    {isFetching ? (
                                        <div className="flex items-center gap-3 rounded-3xl border border-orange-100 bg-white px-5 py-6 text-lg text-slate-700 shadow-sm">
                                            <FiLoader className="animate-spin text-2xl text-orange-500" />
                                            <span>Loading documents...</span>
                                        </div>
                                    ) : (
                                        <div className="grid gap-6 grid-cols-3 my-8">
                                            {services?.map((service: ServicesModel, index: number) => {
                                                const isSelected = item.service_id === service.id;

                                                return (
                                                    <button
                                                        key={service.id}
                                                        type="button"
                                                        onClick={() => handleServiceSelect(service.id ?? 0)}
                                                        className={`kiosk-pop group relative overflow-hidden rounded-[1.75rem] border-2 p-0 text-left transition-all duration-300 ${isSelected
                                                            ? "border-orange-500 bg-linear-to-br from-orange-500 to-amber-500 text-white shadow-[0_22px_45px_rgba(234,88,12,0.28)]"
                                                            : "border-orange-200 bg-white text-slate-800 shadow-[0_18px_35px_rgba(148,163,184,0.16)] hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_22px_40px_rgba(234,88,12,0.16)]"
                                                            }`}
                                                        style={{ animationDelay: `${index * 80}ms` }}
                                                    >
                                                        <div className={`absolute inset-x-0 top-0 h-1.5 ${isSelected ? "bg-white/80" : "bg-linear-to-r from-orange-300 to-amber-300"}`} />
                                                        <div className="flex min-h-56 flex-col justify-between gap-5 px-6 md:min-h-64 md:px-7 py-4">
                                                            <div className="flex items-center justify-between gap-4">
                                                                <div className={`flex h-16 w-16 items-center justify-center rounded-[1.3rem] ${isSelected ? "bg-white/15 text-white" : "bg-orange-100 text-orange-500"}`}>
                                                                    <FiFileText className="text-3xl" />
                                                                </div>
                                                                <div className={`rounded-full px-4 py-2 text-sm inter-semibold md:text-base ${isSelected ? "bg-white/15 text-white" : "bg-orange-50 text-orange-600"}`}>
                                                                    {isSelected ? "Selected" : "Choose"}
                                                                </div>
                                                            </div>

                                                            <div className="space-y-3">
                                                                <p className="inter-bold text-xl leading-tight md:text-[1.5rem] ">
                                                                    {service.name}
                                                                </p>
                                                                <p className={`text-base leading-relaxed md:text-lg ${isSelected ? "text-orange-50" : "text-slate-600"}`}>
                                                                    {service.description ?? "Tap here to start your request for this document."}
                                                                </p>
                                                            </div>

                                                            <div className={` border-t py-4 inter-semibold inline-flex items-center gap-2 text-lg ${isSelected ? "text-white" : "text-orange-600"}`}>
                                                                <span>Start Request</span>
                                                                <FiArrowRightCircle className="text-2xl transition-transform duration-300 group-hover:translate-x-1" />
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <InputError message={getErrorMessage(errors.service_id)} className="text-base" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <BookingDetailsDialog
                    show={showDetailsDialog}
                    onClose={() => setShowDetailsDialog(false)}
                    onContinue={handleDetailsContinue}
                    selectedServiceName={selectedService?.name ?? "Selected Document"}
                    clientName={item.client_name || ""}
                    requestingOffice={item.requesting_office || ""}
                    clientNameError={getErrorMessage(errors.client_name)}
                    requestingOfficeError={getErrorMessage(errors.requesting_office)}
                    onFieldChange={handleChange}
                    isSubmitDisabled={isSubmitDisabled}
                />
                <SuccessDialog show={showSuccessDialog} onClose={closeSuccessDialog} code={item.queue_number} />
                <ErrorDialog show={showErrorDialog} onClose={() => setShowErrorDialog(false)} />
            </BookingLayout>
            <ConfirmationDialog
                show={showConfirmation}
                onClose={() => { setShowConfirmation(false); setShowDetailsDialog(true) }}
                onConfirm={createBookingFn}
                loading={createBooking.isPending}
            />
            {printData && (
                <PrintCode
                    code={printData.code}
                />
            )}
        </>
    );
}
