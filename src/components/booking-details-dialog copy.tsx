import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  FiBriefcase,
  FiChevronDown,
  FiEdit3,
  FiFileText,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import { Button } from "./button";
import InputError from "./input-error";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./text-area";

type Props = {
  show: boolean;
  onClose: () => void;
  onContinue: () => void;
  selectedServiceName: string;
  clientName: string;
  requestingOffice: string;
  position: string;
  purpose: string;
  contactNo: string;
  clientNameError?: string;
  requestingOfficeError?: string;
  positionError?: string;
  purposeError?: string;
  contactNoError?: string;
  isSubmitDisabled: boolean;
  onFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
};

function BookingDetailsDialog({
  show,
  onClose,
  onContinue,
  selectedServiceName,
  clientName,
  requestingOffice,
  position,
  purpose,
  contactNo,
  clientNameError,
  requestingOfficeError,
  positionError,
  purposeError,
  contactNoError,
  isSubmitDisabled,
  onFieldChange,
}: Props) {
  const inputClassName =
    "h-16 rounded-[1.35rem] border-2 border-orange-200 bg-white/90 pl-14 pr-4 text-lg text-slate-900 shadow-[0_10px_25px_rgba(15,23,42,0.06)] transition focus:border-orange-500 focus:ring-4 focus:ring-orange-200/60 md:text-xl";
  const textAreaClassName =
    "min-h-36 rounded-[1.35rem] border-2 border-orange-200 bg-white/90 pl-14 pr-4 pt-4 text-lg text-slate-900 shadow-[0_10px_25px_rgba(15,23,42,0.06)] transition focus:border-orange-500 focus:ring-4 focus:ring-orange-200/60 md:text-xl";
  const iconClassName =
    "pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-orange-500";

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => { }}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-250"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-[2px]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center">
          <Transition.Child
            as={Fragment}
            enter="transform transition duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
            enterFrom="translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transform transition duration-300 ease-in"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-full opacity-0"
          >
            <Dialog.Panel className="w-full max-w-5xl rounded-t-[2.5rem] border border-white/50 bg-[linear-gradient(180deg,rgba(255,247,237,0.98),rgba(255,255,255,0.98))] shadow-[0_-18px_50px_rgba(15,23,42,0.25)]">
              <div className="mx-auto mt-3 h-1.5 w-24 rounded-full bg-orange-200" />

              <div className="px-5 pb-8 pt-8 md:px-8 md:pb-10 md:pt-10">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.6rem] bg-linear-to-br from-orange-500 via-orange-500 to-amber-400 text-white shadow-[0_18px_35px_rgba(234,88,12,0.28)]">
                      <FiEdit3 className="text-3xl" />
                    </div>
                    <div className="space-y-2">
                      <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                        Step 2 of 2
                      </span>
                      <Dialog.Title className="inter-bold text-3xl leading-tight text-slate-900 md:text-4xl">
                        Add Your Details
                      </Dialog.Title>
                      <p className="max-w-2xl text-lg text-slate-600 md:text-xl">
                        {selectedServiceName}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-12 w-12 items-center justify-center border border-orange-300 rounded-full bg-white text-orange-500 shadow-sm transition hover:bg-orange-50 hover:text-orange-600"
                  >
                    <FiChevronDown className="text-2xl" />
                  </button>
                </div>

                <div className="mb-8 rounded-[2rem] border border-orange-200/80 bg-white/75 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-500">
                        Selected Service
                      </p>
                      <p className="mt-2 inter-bold text-2xl text-slate-900 md:text-3xl">
                        {selectedServiceName}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-3 rounded-full bg-orange-100 px-4 py-3 text-orange-700">
                      <FiFileText className="text-xl" />
                      <span className="text-base font-medium md:text-lg">Request ready for review</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-[2rem] border border-orange-100 bg-white/65 p-5 shadow-[0_16px_35px_rgba(15,23,42,0.06)] md:col-span-2">
                    <Label className="inter-semibold mb-3 flex items-center gap-2 text-lg text-slate-800 md:text-xl">
                      <span className="text-orange-500 uppercase">Full Name</span>
                    </Label>
                    <div className="relative">
                      <span className={iconClassName}>
                        <FiUser className="text-2xl" />
                      </span>
                      <Input
                        name="client_name"
                        className={inputClassName}
                        value={clientName}
                        onChange={onFieldChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <InputError message={clientNameError} className="mt-2 text-base" />
                  </div>

                  <div className="rounded-[2rem] border border-orange-100 bg-white/65 p-5 shadow-[0_16px_35px_rgba(15,23,42,0.06)]">
                    <Label className="inter-semibold mb-3 flex items-center gap-2 text-lg text-slate-800 md:text-xl">
                      <span className="text-orange-500 uppercase">Barangay | Requesting Office</span>
                      <span className="text-orange-400 text-sm">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <span className={iconClassName}>
                        <FiMapPin className="text-2xl" />
                      </span>
                      <Input
                        name="requesting_office"
                        className={inputClassName}
                        value={requestingOffice}
                        onChange={onFieldChange}
                        placeholder="e.g. Barangay Hall or office name"
                      />
                    </div>
                    <InputError message={requestingOfficeError} className="mt-2 text-base" />
                  </div>

                  <div className="rounded-[2rem] border border-orange-100 bg-white/65 p-5 shadow-[0_16px_35px_rgba(15,23,42,0.06)]">
                    <Label className="inter-semibold mb-3 flex items-center gap-2 text-lg text-slate-800 md:text-xl">
                      <span className="text-orange-500 uppercase">Designation</span>
                      <span className="text-orange-400 text-sm">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <span className={iconClassName}>
                        <FiBriefcase className="text-2xl" />
                      </span>
                      <Input
                        name="position"
                        className={inputClassName}
                        value={position}
                        onChange={onFieldChange}
                        placeholder="e.g. Staff, Officer, Representative"
                      />
                    </div>
                    <InputError message={positionError} className="mt-2 text-base" />
                  </div>

                  <div className="rounded-[2rem] border border-orange-100 bg-white/65 p-5 shadow-[0_16px_35px_rgba(15,23,42,0.06)]">
                    <Label className="inter-semibold mb-3 flex items-center gap-2 text-lg text-slate-800 md:text-xl">
                      <span className="text-orange-500 uppercase">Contact Number</span>
                      <span className="text-orange-400 text-sm">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <span className={iconClassName}>
                        <FiPhone className="text-2xl" />
                      </span>
                      <Input
                        name="contact_no"
                        className={inputClassName}
                        value={contactNo}
                        onChange={onFieldChange}
                        placeholder="09XXXXXXXXX"
                      />
                    </div>
                    <InputError message={contactNoError} className="mt-2 text-base" />
                  </div>

                  <div className="rounded-[2rem] border border-orange-100 bg-white/65 p-5 shadow-[0_16px_35px_rgba(15,23,42,0.06)] md:col-span-2">
                    <Label className="inter-semibold mb-3 flex items-center gap-2 text-lg text-slate-800 md:text-xl">
                      <span className="text-orange-500 uppercase">Purpose | Remarks</span>
                      <span className="text-orange-400 text-sm">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-5 top-5 text-orange-500">
                        <FiFileText className="text-2xl" />
                      </span>
                      <Textarea
                        name="purpose"
                        className={textAreaClassName}
                        value={purpose}
                        onChange={onFieldChange}
                        rows={4}
                        placeholder="Add any notes or the purpose of your request"
                      />
                    </div>
                    <InputError message={purposeError} className="mt-2 text-base" />
                  </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row">
                  <Button
                    type="button"
                    onClick={onClose}
                    className="h-16 flex-1 rounded-[1.25rem] border-2 border-slate-200 bg-white text-lg text-slate-700 shadow-sm hover:bg-slate-50 md:text-xl"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={onContinue}
                    className="h-16 flex-[1.3] rounded-[1.25rem] bg-linear-to-r from-orange-500 to-amber-500 text-lg text-white shadow-[0_14px_30px_rgba(234,88,12,0.25)] hover:from-orange-600 hover:to-amber-600 md:text-xl"
                    disabled={isSubmitDisabled}
                  >
                    Submit Request
                  </Button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition >
  );
}

export default BookingDetailsDialog;
