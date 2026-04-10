import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiChevronDown, FiEdit3,  FiMapPin, FiUser } from "react-icons/fi";
import { Button } from "./button";
import InputError from "./input-error";
import { Input } from "./input";
import { Label } from "./label";

type Props = {
  show: boolean;
  onClose: () => void;
  onContinue: () => void;
  selectedServiceName: string;
  clientName: string;
  requestingOffice: string;
  clientNameError?: string;
  requestingOfficeError?: string;
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
  clientNameError,
  requestingOfficeError,
  isSubmitDisabled,
  onFieldChange,
}: Props) {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50"onClose={() => {}}>
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

        <div className="fixed inset-0 flex items-end justify-center">
          <Transition.Child
            as={Fragment}
            enter="transform transition duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
            enterFrom="translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transform transition duration-300 ease-in"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-full opacity-0"
          >
            <Dialog.Panel className="w-full max-w-4xl rounded-t-4xl border border-white/40 bg-linear-to-br from-orange-50 via-white to-amber-100 shadow-[0_-18px_50px_rgba(15,23,42,0.25)]">
              <div className="mx-auto mt-3 h-1.5 w-24 rounded-full bg-orange-200" />

              <div className="px-5 pb-8 pt-4 md:px-8 md:pb-10">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 text-white shadow-lg">
                      <FiEdit3 className="text-3xl" />
                    </div>
                    <div className="space-y-2">
                      <Dialog.Title className="inter-bold text-3xl text-slate-900 md:text-4xl">
                        Add Your Details
                      </Dialog.Title>
                      <p className="max-w-2xl text-base text-slate-600 md:text-lg">
                        {selectedServiceName} Request
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

                <div className="grid gap-8 mb-10">
                  <div className="rounded-3xl">
                    <Label className="inter-semibold mb-3 flex items-center gap-2 text-lg text-slate-800">
                    <span className="text-orange-500 uppercase">Full Name</span>
                    </Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-orange-500">
                        <FiUser className="text-2xl" />
                      </span>
                      <Input
                        name="client_name"
                        placeholder="Ex: Juan Dela Cruz"
                        className="h-18 rounded-2xl border-2 border-orange-200 bg-orange-50 pl-14 text-xl text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-300/60"
                        value={clientName}
                        onChange={onFieldChange}
                      />
                    </div>
                    <InputError message={clientNameError} className="mt-2 text-base" />
                  </div>

                  <div className="rounded-3xl">
                    <Label className="inter-semibold mb-3 flex items-center gap-2 text-lg text-slate-800">
                      <span className="text-orange-500 uppercase">Requesting Office </span>
                      <span className="text-gray-400 text-sm">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-orange-500">
                        <FiMapPin className="text-2xl" />
                      </span>
                      <Input
                        name="requesting_office"
                        placeholder="Ex: Maloro, Tangub City"
                        className="h-18 rounded-2xl border-2 border-orange-200 bg-orange-50 pl-14 text-xl text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-300/60"
                        value={requestingOffice}
                        onChange={onFieldChange}
                      />
                    </div>
                    <InputError message={requestingOfficeError} className="mt-2 text-base" />
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
      </Dialog>
    </Transition>
  );
}

export default BookingDetailsDialog;
