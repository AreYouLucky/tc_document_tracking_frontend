import { useState } from "react";
import { FiFileText, FiLoader } from "react-icons/fi";
import BookingDetailsDialog from "../../components/booking-details-dialog";
import PrintCode from "../../components/print-code";
import ErrorDialog from "../../components/error-dialog";
import InputError from "../../components/input-error";
import SuccessDialog from "../../components/success-dialog";
import BookingLayout from "../../layouts/booking-layout";
import type { ServicesModel } from "../../types/models";
import { useHandleChange } from "../../utils/utilities";
import { type FormValueTypes, useCreateBooking, useRequestCoa, useFetchServices } from "./partials/booking-hooks";
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
        position: "",
        purpose: "",
        contact_no: "",
        service_id: null,
        queue_number: "",
        currentDate: "",
        type: 1
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
            type: 1
        }));
        setErrors((prev) => ({
            ...prev,
            service_id: undefined,
        }));

        setShowConfirmation(true);
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

    const requestCoa = useRequestCoa();
    const requestCoaFn = () => {
        setShowConfirmation(false);
        const formData = new FormData();
        formData.append("service_id", String(item.service_id ?? ''));
        formData.append("fullname", String(item.client_name ?? ''));
        formData.append("requesting_office", String(item.requesting_office ?? ''));
        formData.append("position", String(item.position ?? ''));
        formData.append("purpose", String(item.purpose ?? ''));
        formData.append("contact_no", String(item.contact_no ?? ''));

        requestCoa.mutate(formData, {
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
    }
    const handleCoaRequest = () => {
        setItem({
            client_name: "",
            requesting_office: "",
            service_id: null,
            queue_number: "",
            position: "",
            purpose: "",
            contact_no: "",
            type: 2
        });
        setShowDetailsDialog(true);
    }


    const closeSuccessDialog = () => {
        setShowSuccessDialog(false);
        setItem({
            client_name: "",
            requesting_office: "",
            service_id: null,
            queue_number: "",
            position: "",
            purpose: "",
            contact_no: "",
            type: 1
        });
        createBooking.reset();
    };

    const isSubmitDisabled =
        !item.client_name?.trim() || isFetching || createBooking.isPending || requestCoa.isPending;

    return (
        <>
            <BookingLayout>
                <section className="print:hidden">
                    <div className="kiosk-rise relative overflow-hidden rounded-[2.25rem] border border-white/20  shadow-[0_24px_80px_rgba(15,23,42,0.18)] ">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(253,186,116,0.26),transparent_30%)]" />
                        <div className="relative rounded-[1.75rem] bg-orange-50 p-5 md:p-8">

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
                                        <div className="grid gap-6  my-8">
                                            <button
                                                type="button"
                                                onClick={handleCoaRequest}
                                                className={`kiosk-pop group  shadow-xl shadow-gray-200  relative overflow-hidden rounded-full border-2 text-left transition-all duration-300 ${item.type === 2
                                                    ? "border-orange-500 bg-linear-to-br from-orange-500 to-amber-500 text-white "
                                                    : "border-orange-200 bg-white text-slate-800 shadow-[0_18px_35px_rgba(148,163,184,0.16)] hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_22px_40px_rgba(234,88,12,0.16)]"
                                                    }`}
                                                style={{ animationDelay: `80ms` }}
                                            >
                                                <div className="flex  flex-row  justify-center items-center py-8">
                                                    <div className="flex  flex-row gap-5">
                                                        <FiFileText className="text-3xl" />
                                                        <p className="inter-semibold text-3xl leading-tight ">
                                                            Certificate of Appearance
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                            {services?.map((service: ServicesModel, index: number) => {
                                                const isSelected = item.service_id === service.id;

                                                return (
                                                    <button
                                                        key={service.id}
                                                        type="button"
                                                        onClick={() => handleServiceSelect(service.id ?? 0)}
                                                        className={`kiosk-pop group  shadow-xl shadow-gray-200  relative overflow-hidden rounded-full border-2 text-left transition-all duration-300 ${isSelected
                                                            ? "border-orange-500 bg-linear-to-br from-orange-500 to-amber-500 text-white "
                                                            : "border-orange-200 bg-white text-slate-800 shadow-[0_18px_35px_rgba(148,163,184,0.16)] hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_22px_40px_rgba(234,88,12,0.16)]"
                                                            }`}
                                                        style={{ animationDelay: `${index * 80}ms` }}
                                                    >
                                                        <div className="flex  flex-row  justify-center items-center py-8">
                                                            <div className="flex  flex-row gap-5">
                                                                <FiFileText className="text-3xl" />
                                                                <p className="inter-semibold text-3xl leading-tight ">
                                                                    {service.name}
                                                                </p>
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
                    selectedServiceName={selectedService?.name ?? "Certificate of Appearance"}
                    clientName={item.client_name || ""}
                    requestingOffice={item.requesting_office || ""}
                    position={item.position || ""}
                    purpose={item.purpose || ""}
                    contactNo={item.contact_no || ""}
                    clientNameError={getErrorMessage(errors.client_name)}
                    requestingOfficeError={getErrorMessage(errors.requesting_office)}
                    positionError={getErrorMessage(errors.position)}
                    purposeError={getErrorMessage(errors.purpose)}
                    contactNoError={getErrorMessage(errors.contact_no)}
                    onFieldChange={handleChange}
                    isSubmitDisabled={isSubmitDisabled}
                />
                <SuccessDialog show={showSuccessDialog} onClose={closeSuccessDialog} code={item.queue_number} />
                <ErrorDialog show={showErrorDialog} onClose={() => setShowErrorDialog(false)} />
            </BookingLayout>
            <ConfirmationDialog
                show={showConfirmation}
                onClose={() => {
                    setShowConfirmation(false);

                    if (item?.type === 2) {
                        setShowDetailsDialog(true);
                    }
                }}
                onConfirm={item.type === 1 ? createBookingFn : requestCoaFn}
                loading={createBooking.isPending || requestCoa.isPending}
            />
            {printData && (
                <PrintCode
                    code={printData.code}
                />
            )}
        </>
    );
}
