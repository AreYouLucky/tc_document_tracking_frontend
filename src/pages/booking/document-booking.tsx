import BookingLayout from "../../layouts/booking-layout";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import InputError from "../../components/input-error";
import { InputRadio } from "../../components/input-radio";
import { type FormValueTypes, useFetchServices, useCreateBooking } from "./partials/booking-hooks";
import { useHandleChange } from "../../utils/utilities";
import type { ServicesModel } from "../../types/models";
import { Button } from "../../components/button";
import { FiUser, FiMapPin, FiFileText, FiInfo, FiArrowRightCircle, FiLoader } from "react-icons/fi";
import { Spinner } from "../../components/spinner";
import SuccessDialog from "../../components/success-dialog";
import ErrorDialog from "../../components/error-dialog";
import { useState, useEffect } from "react";
import CertificateOfAppearance from "../../components/certificate-appearance";


export default function DocumentBooking() {
    const { data: services, isFetching } = useFetchServices();
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [printData, setPrintData] = useState<{
        name: string;
        office: string;
        currentDate: string;
        service: string;
        code: string;
    } | null>(null);
    const { item, setItem, handleChange, errors, setErrors } = useHandleChange<FormValueTypes>({
        client_name: "",
        requesting_office: "",
        service_id: null,
        queue_number: "",
        currentDate: ''
    });

    const getCurrentDate = () => {
        return new Date().toLocaleDateString("en-PH", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    const createBooking = useCreateBooking();
    const createBookingFn = () => {
        const formData = new FormData();
        formData.append("client_name", item.client_name!);
        formData.append("requesting_office", item.requesting_office!);
        formData.append("service_id", String(item.service_id!));
        createBooking.mutate(formData,
            {
                onSuccess: (data) => {
                    setShowSuccessDialog(true);
                    if (data) {
                        setItem({
                            ...item,
                            queue_number: data.data?.queue_number ?? '',
                        });
                        setPrintData({
                            name: data?.data?.client_name ?? item.client_name ?? "",
                            office: data?.data?.requesting_office ?? item.requesting_office ?? "",
                            service: services?.find((s) => s.id === item.service_id)?.name ?? "",
                            currentDate: getCurrentDate(),
                            code: data?.data?.queue_number ?? ""
                        });
                    }
                },
                onError: (error) => {
                    if (error.response?.data?.errors) {
                        setErrors(error.response?.data.errors ?? {});
                    }
                    setShowErrorDialog(true);
                }
            }
        );
    }

    useEffect(() => {
        if (!printData) return;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.print();
            });
        });
    }, [printData]);
    const closeSuccessDialog = () => {
        setShowSuccessDialog(false);
        setItem({
            client_name: "",
            requesting_office: "",
            service_id: null,
            queue_number: ""
        })
        createBooking.reset();
    }

    const isSubmitDisabled =
        !item.client_name?.trim() || !item.requesting_office?.trim() || !item.service_id || isFetching || createBooking.isPending;

    return (
        <>
            <BookingLayout>
                <section className=" px-6 py-6 md:px-8 md:py-2 space-y-7 mb-6 print:hidden">
                    <header className="flex items-start gap-3 bg-linear-to-tr from-orange-500/90 to-yellow-600/90 p-4 rounded-xl ">
                        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                            <FiFileText className="text-xl" />
                        </div>
                        <div>
                            <h2 className="inter-bold text-[16px] text-white">
                                Document Request Information
                            </h2>
                            <p className="text-[14px] text-gray-100">
                                Please fill out the details below to generate your request code.{" "}
                                <span className="italic">
                                    (Palihug og kumpleto sa impormasyon aron makuha ang imong request code.)
                                </span>
                            </p>
                        </div>
                    </header>
                    <div className="grid gap-3">
                        <Label className="text-slate-800 inter-semibold flex items-center gap-2">
                            <FiUser className="text-white" />
                            <span>Full Name (Tibuok nga Ngalan)</span>
                        </Label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-orange-500">
                                <FiUser className="text-lg" />
                            </span>
                            <Input
                                name="client_name"
                                placeholder="Ex: Juan Dela Cruz"
                                className="bg-white border border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300/60 pl-10 py-2.5 rounded-lg text-sm md:text-base"
                                value={item.client_name || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <InputError message={errors.client_name} />
                    </div>
                    <div className="grid gap-3">
                        <Label className="text-slate-800 inter-semibold flex items-center gap-2">
                            <FiMapPin className="text-white" />
                            <span>requesting_office / Barangay (Pangalan sa Opisina o Barangay)</span>
                        </Label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-orange-500">
                                <FiMapPin className="text-lg" />
                            </span>
                            <Input
                                name="requesting_office"
                                placeholder="Ex: Maloro, Tangub City"
                                className="bg-white border border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300/60 pl-10 py-2.5 rounded-lg text-sm md:text-base"
                                value={item.requesting_office || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <InputError message={errors.requesting_office} />
                    </div>

                    <div className="grid gap-4">
                        <div className="flex items-center justify-between gap-2">
                            <Label className="text-slate-800 inter-semibold flex items-center gap-2">
                                <FiFileText className="text-white" />
                                <span>Select Document (Pilia ang dokumento nga imong kinahanglan)</span>
                            </Label>
                            <span className="flex items-center gap-1 text-[11px] md:text-xs text-white">
                                <FiInfo />
                                <span>Tap a document card to select</span>
                            </span>
                        </div>

                        {isFetching ? (
                            <div className="flex items-center gap-2 text-slate-600 text-sm mt-1">
                                <FiLoader className="animate-spin" />
                                <span>Loading services…</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {services?.map((service: ServicesModel) => {

                                    return (
                                        <InputRadio
                                            key={service.id}
                                            name="service"
                                            value={service.id ?? 0}
                                            selectedValue={item.service_id ?? 0}
                                            onChange={() => setItem({ ...item, service_id: service.id ?? 0 })}
                                        >
                                            <div className="p-4 flex items-center justify-center h-full flex-col ">
                                                <p className="inter-regular text-[13px] text-center">
                                                    {service.name}
                                                </p>
                                                <p className="text-[12px] text-gray-200">{service.description ?? ''}</p>
                                            </div>
                                        </InputRadio>
                                    );
                                })}
                            </div>
                        )}

                        <InputError message={errors.service_id} />
                    </div>
                    <div className="flex items-start gap-2 text-[13px] md:text-sm text-slate-700 bg-orange-50/80 inter-regular border border-orange-100 rounded-lg px-3 py-4">
                        <FiInfo className="mt-0.5 text-orange-500" />
                        <p>
                            Please double-check your details before submitting. Your request code will
                            be used to track the status of your document.{" "}
                            <span className="italic">
                                (Siguradua nga sakto ang tanan nga detalye sa dili pa nimo i-submit.
                                Gamitan ang request code aron masubay ang imong dokumento.)
                            </span>
                        </p>
                    </div>

                    <div className="flex justify-center items-center pt-2">
                        <Button
                            className=" bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed px-6 md:px-8 py-4 rounded-xl flex items-center gap-2 inter-semibold text-sm md:text-[16px] text-white border transition-all inter-bold"
                            disabled={isSubmitDisabled}
                            onClick={createBookingFn}
                        >
                            <span>Submit and Print Request Code</span>
                            {createBooking.isPending ?
                                <Spinner className="text-2xl" /> :
                                <FiArrowRightCircle className="text-2xl" />
                            }
                        </Button>
                    </div>
                </section>
                <SuccessDialog show={showSuccessDialog} onClose={closeSuccessDialog} code={item.queue_number} />
                <ErrorDialog show={showErrorDialog} onClose={() => setShowErrorDialog(false)} />
            </BookingLayout>
            {printData && (
                <CertificateOfAppearance name={printData.name} currentDate={printData.currentDate} service={printData.service} code={printData.code} />
            )}
        </>
    );
}