import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  FiBriefcase,
  FiChevronDown,
  FiEdit3,
  FiFileText,
  FiHeart,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import { Button } from "./button";
import InputError from "./input-error";
import { Input } from "./input";
import { Label } from "./label";
import { Select } from "./select";
import { Textarea } from "./text-area";

type Props = {
  show: boolean;
  onClose: () => void;
  onContinue: () => void;
  selectedServiceName: string;
  clientName: string;
  sex: string;
  requestingOffice: string;
  position: string;
  purpose: string;
  contactNo: string;
  clientNameError?: string;
  sexError?: string;
  requestingOfficeError?: string;
  positionError?: string;
  purposeError?: string;
  contactNoError?: string;
  isSubmitDisabled: boolean;
  onSexChange: (value: string) => void;
  onFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

function BookingDetailsDialog({
  show,
  onClose,
  onContinue,
  selectedServiceName,
  clientName,
  sex,
  requestingOffice,
  position,
  purpose,
  contactNo,
  clientNameError,
  sexError,
  requestingOfficeError,
  positionError,
  purposeError,
  contactNoError,
  isSubmitDisabled,
  onSexChange,
  onFieldChange,
}: Props) {
  const inputClassName =
    "h-16 rounded-xl border-2 border-orange-200 bg-white/90 pl-14 pr-4 text-lg text-slate-900 shadow-[0_10px_25px_rgba(15,23,42,0.06)] transition focus:border-orange-500 focus:ring-4 focus:ring-orange-200/60 md:text-xl";
  const textAreaClassName =
    "min-h-36 rounded-2xl border-2 border-orange-200 bg-white/90 pl-14 pr-4 pt-4 text-lg text-slate-900 shadow-[0_10px_25px_rgba(15,23,42,0.06)] transition focus:border-orange-500 focus:ring-4 focus:ring-orange-200/60 md:text-xl";
  const iconClassName =
    "pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-orange-500";
  const requiredLabel = (
    <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-orange-600">
      Required
    </span>
  );

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
              <Dialog.Panel className="w-full max-w-5xl rounded-t-[2.5rem] border border-white/50 bg-[linear-gradient(180deg,rgba(255,247,237,0.98),rgba(255,255,255,0.98))] shadow-[0_-18px_50px_rgba(15,23,42,0.25)] pb-10">
                <div className="mx-auto mt-3 h-1.5 w-24 rounded-full bg-orange-200" />

                <div className="px-5 pb-8 pt-8 md:px-8 md:pb-10 md:pt-10">
                  <div className="mb-7 flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
                      <div className="flex h-14 w-14 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 via-orange-500 to-amber-400 text-white shadow-lg">
                        <FiEdit3 className="text-2xl md:text-3xl" />
                      </div>
                      <div className="flex flex-col justify-center space-y-1 text-center md:text-left">
                        <Dialog.Title className="inter-bold text-xl md:text-3xl leading-tight text-slate-900">
                          Add Your Details
                        </Dialog.Title>

                        <p className="text-sm md:text-lg text-slate-600 max-w-3xl">
                          Please fill out the form below to submit your request for{" "}
                          <span className="font-semibold text-orange-500">
                            {selectedServiceName}
                          </span>
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

                  <div className="grid gap-y-10 gap-x-5 md:grid-cols-2 p-5">
                    <div className="md:col-span-2">
                      <Label className="inter-semibold mb-3 flex items-center gap-2 text-lg text-slate-800 md:text-lg">
                        <span className="text-orange-500 uppercase">Full Name</span>
                        {requiredLabel}
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
                          required
                          aria-invalid={Boolean(clientNameError)}
                        />
                      </div>
                      <InputError message={clientNameError} className="mt-2 text-base" />
                    </div>

                    <div className="">
                      <Label className="inter-semibold mb-3 flex items-center gap-2 text-lg text-slate-800 md:text-lg">
                        <span className="text-orange-500 uppercase">Sex</span>
                        {requiredLabel}
                      </Label>
                      <Select
                        value={sex}
                        onChange={onSexChange}
                        icon={<FiHeart className="text-2xl" />}
                        placeholder="Select sex"
                        options={[
                          { label: "Male", value: "Male" },
                          { label: "Female", value: "Female" },
                        ]}
                        buttonClassName={inputClassName}
                      />
                      <InputError message={sexError} className="mt-2 text-base" />
                    </div>

                     <div className="">
                      <Label className="inter-semibold mb-3 flex items-center gap-2 text-lg text-slate-800 md:text-lg">
                        <span className="text-orange-500 uppercase">Designation</span>
                        {requiredLabel}
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
                          required
                          aria-invalid={Boolean(positionError)}
                        />
                      </div>
                      <InputError message={positionError} className="mt-2 text-base" />
                    </div>

                    <div className="col-span-2">
                      <Label className="inter-semibold mb-3 flex items-center gap-2 text-lg text-slate-800 md:text-lg">
                        <span className="text-orange-500 uppercase">Barangay | Requesting Office</span>
                        {requiredLabel}
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
                          required
                          aria-invalid={Boolean(requestingOfficeError)}
                        />
                      </div>
                      <InputError message={requestingOfficeError} className="mt-2 text-base" />
                    </div>

                   

                    <div className=" md:col-span-2">
                      <Label className="inter-semibold mb-3 flex items-center gap-2 text-lg text-slate-800 md:text-lg">
                        <span className="text-orange-500 uppercase">Contact Number</span>
                        {requiredLabel}
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
                          required
                          aria-invalid={Boolean(contactNoError)}
                        />
                      </div>
                      <InputError message={contactNoError} className="mt-2 text-base" />
                    </div>

                    <div className="md:col-span-2">
                      <Label className="inter-semibold mb-3 flex items-center gap-2 text-lg text-slate-800 md:text-lg">
                        <span className="text-orange-500 uppercase">Purpose | Remarks</span>
                        {requiredLabel}
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
                          required
                          aria-invalid={Boolean(purposeError)}
                        />
                      </div>
                      <InputError message={purposeError} className="mt-2 text-base" />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row px-5">
                    <Button
                      type="button"
                      onClick={onClose}
                      className="h-16 flex-1 rounded-4xl border-2 border-slate-300 bg-white text-lg text-slate-700 shadow-sm hover:bg-slate-50 md:text-xl"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={onContinue}
                      className="h-16 flex-[1.3] rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-lg text-white shadow-[0_14px_30px_rgba(234,88,12,0.25)] hover:from-orange-600 hover:to-amber-600 md:text-xl"
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
