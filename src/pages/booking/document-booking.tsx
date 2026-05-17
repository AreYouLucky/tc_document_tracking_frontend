import { useState } from "react";
import { FiArrowRight, FiFileText, FiLayers, FiLoader, FiStar } from "react-icons/fi";
import BookingDetailsDialog from "../../components/booking-details-dialog";
import PrintCode from "../../components/print-code";
import ErrorDialog from "../../components/error-dialog";
import InputError from "../../components/input-error";
import SuccessDialog from "../../components/success-dialog";
import BookingLayout from "../../layouts/booking-layout";
import type { ServicesModel } from "../../types/models";
import { useHandleChange } from "../../utils/utilities";
import {
    type BudgetMonitoring,
    type FormValueTypes,
    type Office,
    useCheckOfficeBalance,
    useCreateBooking,
    useFetchOffices,
    useFetchServices,
    useRequestCoa,
    useRequestOthers,
} from "./partials/booking-hooks";
import HeaderInfo from "./partials/header-info";
import ConfirmationDialog from "../../components/confirmation-dialog";
import { GrCertificate } from "react-icons/gr";
import { MdOutlinePageview } from "react-icons/md";
import { TbCashRegister } from "react-icons/tb";
import CheckBalanceDialog from "../../components/check-balance/check-balance-dialog";
import CheckBalanceSuccess from "../../components/check-balance/check-balance-sucess";
import CheckBalanceIncorrect from "../../components/check-balance/check-balance-incorrect";
export default function DocumentBooking() {
    const { data: services, isFetching } = useFetchServices();
    const { data: offices = [], isFetching: isFetchingOffices } = useFetchOffices();
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showCheckBalanceDialog, setShowCheckBalanceDialog] = useState(false);
    const [showCheckBalanceSuccess, setShowCheckBalanceSuccess] = useState(false);
    const [showCheckBalanceIncorrect, setShowCheckBalanceIncorrect] = useState(false);
    const [selectedOfficeId, setSelectedOfficeId] = useState("");
    const [selectedOfficeName, setSelectedOfficeName] = useState("");
    const [balancePin, setBalancePin] = useState("");
    const [balanceOffice, setBalanceOffice] = useState<Office | null>(null);
    const [budgetMonitoring, setBudgetMonitoring] = useState<BudgetMonitoring[]>([]);
    const [checkBalanceMessage, setCheckBalanceMessage] = useState("Incorrect PIN. Please try again.");
    const [checkBalanceErrors, setCheckBalanceErrors] = useState<{
        office?: string;
        pin?: string;
    }>({});
    const [printData, setPrintData] = useState<{
        code: string;
    } | null>(null);

    const { item, setItem, handleChange, errors, setErrors } = useHandleChange<FormValueTypes>({
        client_name: "",
        sex: "",
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
    const selectedServiceName =
        item.type === 2
            ? "Certificate of Appearance"
            : item.type === 3
                ? "Other Services"
                : selectedService?.name ?? "Document Request";
    const createBooking = useCreateBooking();
    const checkOfficeBalance = useCheckOfficeBalance();
    const isCheckBalanceActive =
        showCheckBalanceDialog || showCheckBalanceSuccess || showCheckBalanceIncorrect;

    const getErrorMessage = (value: unknown) => {
        if (Array.isArray(value)) return value[0] ?? "";
        return typeof value === "string" ? value : "";
    };

    const resetCheckBalanceForm = () => {
        setSelectedOfficeId("");
        setSelectedOfficeName("");
        setBalancePin("");
        setBalanceOffice(null);
        setBudgetMonitoring([]);
        setCheckBalanceErrors({});
        setCheckBalanceMessage("Incorrect PIN. Please try again.");
        checkOfficeBalance.reset();
    };

    const openCheckBalanceDialog = () => {
        resetCheckBalanceForm();
        setShowCheckBalanceDialog(true);
    };

    const closeCheckBalanceDialog = () => {
        setShowCheckBalanceDialog(false);
        setCheckBalanceErrors({});
    };

    const closeCheckBalanceSuccess = () => {
        setShowCheckBalanceSuccess(false);
        resetCheckBalanceForm();
    };

    const closeCheckBalanceIncorrect = () => {
        setShowCheckBalanceIncorrect(false);
        setCheckBalanceMessage("Incorrect PIN. Please try again.");
    };

    const handleServiceSelect = (serviceId: number) => {
        setItem((prev) => ({
            ...prev,
            service_id: serviceId,
            type: 1,
            client_name: "",
            sex: "",
            requesting_office: "",
            queue_number: "",
            position: "",
            purpose: "",
            contact_no: "",

        }));
        setErrors((prev) => ({
            ...prev,
            service_id: undefined,
        }));

        setShowDetailsDialog(true)
    };

    const handleSexChange = (value: string) => {
        setItem((prev) => ({
            ...prev,
            sex: value,
        }));
        setErrors((prev) => ({
            ...prev,
            sex: undefined,
        }));
    };

    const handleDetailsContinue = () => {
        const nextErrors: Partial<Record<keyof FormValueTypes, string>> = {};

        if (!item.client_name?.trim()) {
            nextErrors.client_name = "Please enter your full name.";
        }

        if (!item.sex?.trim()) {
            nextErrors.sex = "Please select your sex.";
        }

        if (!item.position?.trim()) {
            nextErrors.position = "Please enter your designation.";
        }

        if (!item.requesting_office?.trim()) {
            nextErrors.requesting_office = "Please enter your barangay or requesting office.";
        }

        if (!item.contact_no?.trim()) {
            nextErrors.contact_no = "Please enter your contact number.";
        }

        if (!item.purpose?.trim()) {
            nextErrors.purpose = "Please enter the purpose or remarks.";
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

    const handleOfficeChange = (value: string) => {
        const office = offices.find((entry) => entry.id === value);
        setSelectedOfficeId(value);
        setSelectedOfficeName(office?.name ?? "");
        setCheckBalanceErrors((prev) => ({
            ...prev,
            office: undefined,
        }));
    };

    const handleBalancePinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBalancePin(event.target.value);
        setCheckBalanceErrors((prev) => ({
            ...prev,
            pin: undefined,
        }));
    };

    const handleCheckBalanceSubmit = () => {
        const nextErrors: {
            office?: string;
            pin?: string;
        } = {};

        if (!selectedOfficeId) {
            nextErrors.office = "Please select an office.";
        }

        if (!balancePin.trim()) {
            nextErrors.pin = "Please enter your PIN.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setCheckBalanceErrors(nextErrors);
            return;
        }

        checkOfficeBalance.mutate(
            {
                officeId: selectedOfficeId,
                pin: balancePin.trim(),
            },
            {
                onSuccess: (data) => {
                    const office = data.data[0] ?? null;

                    setBalanceOffice(office);
                    setSelectedOfficeName(office?.name ?? selectedOfficeName);
                    setBudgetMonitoring(office?.budget_monitoring ?? []);
                    setShowCheckBalanceDialog(false);
                    setShowCheckBalanceSuccess(true);
                },
                onError: (error) => {
                    const message =
                        error.response?.data?.message ||
                        "Incorrect PIN. Please try again.";

                    setCheckBalanceMessage(message);
                    setShowCheckBalanceDialog(false);
                    setShowCheckBalanceIncorrect(true);
                },
            }
        );
    };

    const createBookingFn = () => {
        setShowConfirmation(false);
        const formData = createFormData();

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

    const createFormData = () => {
        const formData = new FormData();
        if (item.type === 1) {
            formData.append("service_id", String(item.service_id ?? ''));
        }
        formData.append("client_name", String(item.client_name ?? ''));
        formData.append("requesting_office", String(item.requesting_office ?? ''));
        formData.append("position", String(item.position ?? ''));
        formData.append("remarks", String(item.purpose ?? ''));
        formData.append("contact_no", String(item.contact_no ?? ''));
        formData.append("sex", String(item.sex ?? ''));
        return formData
    }

    const requestCoa = useRequestCoa();
    const requestCoaFn = () => {
        setShowConfirmation(false);
        const formData = createFormData();


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
            sex: "",
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

    const handleOtherRequest = () => {
        setItem({
            client_name: "",
            sex: "",
            requesting_office: "",
            service_id: null,
            queue_number: "",
            position: "",
            purpose: "",
            contact_no: "",
            type: 3
        });
        setShowDetailsDialog(true);
    }



    const closeSuccessDialog = () => {
        setShowSuccessDialog(false);
        setItem({
            client_name: "",
            sex: "",
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

    const requestOthers = useRequestOthers();
    const requestOthersFn = () => {
        setShowConfirmation(false);
        const formData = createFormData();


        requestOthers.mutate(formData, {
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

    const isSubmitDisabled =
        isFetching ||
        createBooking.isPending ||
        requestCoa.isPending ||
        requestOthers.isPending;

    const getCardClassName = (isSelected: boolean, tone: "primary" | "accent" = "primary") => {
        if (isSelected) {
            return tone === "accent"
                ? "border-amber-500 bg-linear-to-br from-amber-500 to-orange-500 text-white shadow-[0_24px_44px_rgba(217,119,6,0.26)]"
                : "border-orange-500 bg-linear-to-br from-orange-500 to-amber-500 text-white shadow-[0_24px_44px_rgba(234,88,12,0.24)]";
        }

        return tone === "accent"
            ? "border-amber-200 bg-white/95 text-slate-800 shadow-[0_18px_35px_rgba(148,163,184,0.14)] hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_22px_40px_rgba(217,119,6,0.16)]"
            : "border-orange-200 bg-white text-slate-800 shadow-[0_18px_35px_rgba(148,163,184,0.16)] hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_22px_40px_rgba(234,88,12,0.16)]";
    };

    return (
        <>
            <BookingLayout>
                <section className="print:hidden">
                    <div className="kiosk-rise relative overflow-hidden rounded-[2.25rem] border border-white/20 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(253,186,116,0.26),transparent_30%)]" />
                        <div className="relative rounded-[1.75rem] bg-orange-50 p-5 md:p-8">

                            <div className="space-y-6">
                                <HeaderInfo />

                                <div className="mt-10 space-y-6 px-5">
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
                                        <div className="rounded-2xl border border-orange-200/80 bg-white/70 p-4 shadow-[0_20px_45px_rgba(148,163,184,0.12)] backdrop-blur-sm md:p-6">
                                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-800">
                                                        <FiLayers className="text-base" />
                                                        Main Services
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 grid gap-5">
                                                {services?.map((service: ServicesModel, index: number) => {
                                                    const isSelected = item.service_id === service.id;

                                                    return (
                                                        <button
                                                            key={service.id}
                                                            type="button"
                                                            onClick={() => handleServiceSelect(service.id ?? 0)}
                                                            className={`kiosk-pop group relative overflow-hidden rounded-[1.75rem] border-2 text-left transition-all duration-300 ${getCardClassName(isSelected)}`}
                                                            style={{ animationDelay: `${index * 80}ms` }}
                                                        >
                                                            <div className="absolute inset-y-0 right-0 w-32 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_70%)] opacity-70" />
                                                            <div className="relative flex items-center justify-between gap-4 px-6 py-6 md:px-8 md:py-7">
                                                                <div className="flex items-center gap-4 md:gap-5">
                                                                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${isSelected ? "bg-white/20" : "bg-orange-100 text-orange-600"}`}>
                                                                        <FiFileText className="text-2xl md:text-3xl" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="inter-semibold text-2xl leading-tight md:text-3xl">
                                                                            {service.name}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <FiArrowRight className={`shrink-0 text-2xl transition-transform duration-300 group-hover:translate-x-1 ${isSelected ? "text-white" : "text-orange-500"}`} />
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    <div className="rounded-2xl border border-amber-200/90 bg-linear-to-br from-amber-50 via-orange-50 to-white p-4 shadow-[0_22px_45px_rgba(245,158,11,0.12)] md:p-6">
                                        <div className="flex flex-col gap-3  md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900">
                                                    <FiStar className="text-base" />
                                                    Special Requests
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                                            <button
                                                type="button"
                                                onClick={handleCoaRequest}
                                                className={`kiosk-pop group relative overflow-hidden rounded-[1.75rem] border-2 text-left transition-all duration-300 ${getCardClassName(item.type === 2, "accent")}`}
                                                style={{ animationDelay: `80ms` }}
                                            >
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_42%)]" />
                                                <div className="relative flex h-full flex-col justify-between gap-6 px-6 py-6 md:px-7 md:py-7">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.type === 2 ? "bg-white/20" : "bg-amber-100 text-amber-600"}`}>
                                                            <GrCertificate className="text-2xl md:text-3xl" />
                                                        </div>
                                                        <div>
                                                            <p className="inter-semibold text-2xl leading-tight md:text-[1.6rem]">
                                                                Certificate of Appearance
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={openCheckBalanceDialog}
                                                className={`kiosk-pop group relative overflow-hidden rounded-[1.75rem] border-2 text-left transition-all duration-300 ${getCardClassName(isCheckBalanceActive, "accent")}`}
                                                style={{ animationDelay: `140ms` }}
                                            >
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_42%)]" />
                                                <div className="relative flex h-full flex-col justify-center gap-6 px-6 py-6 md:px-7 md:py-7">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${isCheckBalanceActive ? "bg-white/20" : "bg-amber-100 text-amber-600"}`}>
                                                            <TbCashRegister className="text-2xl md:text-3xl" />
                                                        </div>
                                                        <div>
                                                            <p className="inter-semibold text-2xl leading-tight md:text-[1.85rem]">
                                                                Check Balance
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleOtherRequest}
                                                className={`kiosk-pop group col-span-2 relative overflow-hidden rounded-[1.75rem] border-2 text-left transition-all duration-300 ${getCardClassName(item.type === 3, "accent")}`}
                                                style={{ animationDelay: `140ms` }}
                                            >
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_42%)]" />
                                                <div className="relative flex h-full flex-col justify-between gap-6 px-6 py-6 md:px-7 md:py-7">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.type === 3 ? "bg-white/20" : "bg-amber-100 text-amber-600"}`}>
                                                            <MdOutlinePageview className="text-2xl md:text-3xl" />
                                                        </div>
                                                        <div>
                                                            <p className="inter-semibold text-2xl leading-tight md:text-[1.85rem]">
                                                                Other Services
                                                            </p>
                                                            <p className={`mt-1 text-sm  ${item.type === 3 ? "text-orange-50/90" : "text-slate-500"}`}>
                                                                If the service you need is not in the main list
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

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
                    selectedServiceName={selectedServiceName}
                    clientName={item.client_name || ""}
                    sex={item.sex || ""}
                    requestingOffice={item.requesting_office || ""}
                    position={item.position || ""}
                    purpose={item.purpose || ""}
                    contactNo={item.contact_no || ""}
                    clientNameError={getErrorMessage(errors.client_name)}
                    sexError={getErrorMessage(errors.sex)}
                    requestingOfficeError={getErrorMessage(errors.requesting_office)}
                    positionError={getErrorMessage(errors.position)}
                    purposeError={getErrorMessage(errors.purpose)}
                    contactNoError={getErrorMessage(errors.contact_no)}
                    onSexChange={handleSexChange}
                    onFieldChange={handleChange}
                    isSubmitDisabled={isSubmitDisabled}
                />
                <CheckBalanceDialog
                    show={showCheckBalanceDialog}
                    onClose={closeCheckBalanceDialog}
                    onSubmit={handleCheckBalanceSubmit}
                    offices={offices}
                    selectedOfficeId={selectedOfficeId}
                    pin={balancePin}
                    officeError={checkBalanceErrors.office}
                    pinError={checkBalanceErrors.pin}
                    isLoading={checkOfficeBalance.isPending}
                    isOfficesLoading={isFetchingOffices}
                    onOfficeChange={handleOfficeChange}
                    onPinChange={handleBalancePinChange}
                />
                <SuccessDialog show={showSuccessDialog} onClose={closeSuccessDialog} code={item.queue_number} />
                <ErrorDialog show={showErrorDialog} onClose={() => setShowErrorDialog(false)} />
                <CheckBalanceSuccess
                    show={showCheckBalanceSuccess}
                    onClose={closeCheckBalanceSuccess}
                    officeName={balanceOffice?.name ?? selectedOfficeName}
                    budgetMonitoring={budgetMonitoring}
                />
                <CheckBalanceIncorrect
                    show={showCheckBalanceIncorrect}
                    onClose={closeCheckBalanceIncorrect}
                    onRetry={() => {
                        setShowCheckBalanceIncorrect(false);
                        setShowCheckBalanceDialog(true);
                    }}
                    message={checkBalanceMessage}
                />
            </BookingLayout>
            <ConfirmationDialog
                show={showConfirmation}
                onClose={() => {
                    setShowConfirmation(false);

                    if (item?.type !== 1) {
                        setShowDetailsDialog(true);
                    }
                }}
                onConfirm={item.type === 1 ? createBookingFn : item.type === 2 ? requestCoaFn : item.type === 3 ? requestOthersFn : createBookingFn}
                loading={createBooking.isPending || requestCoa.isPending || requestOthers.isPending}
            />
            {printData && (
                <PrintCode
                    code={printData.code}
                />
            )}
        </>
    );
}
