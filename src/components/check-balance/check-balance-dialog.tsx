import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiBriefcase, FiChevronDown, FiCreditCard, FiLock } from "react-icons/fi";
import type { OfficeOption } from "../../pages/booking/partials/booking-hooks";
import { Button } from "../button";
import InputError from "../input-error";
import { Input } from "../input";
import { Label } from "../label";
import { Select } from "../select";

type Props = {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  offices: OfficeOption[];
  selectedOfficeId: string;
  pin: string;
  officeError?: string;
  pinError?: string;
  isLoading: boolean;
  isOfficesLoading: boolean;
  onOfficeChange: (value: string) => void;
  onPinChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function CheckBalanceDialog({
  show,
  onClose,
  onSubmit,
  offices,
  selectedOfficeId,
  pin,
  officeError,
  pinError,
  isLoading,
  isOfficesLoading,
  onOfficeChange,
  onPinChange,
}: Props) {
  const inputClassName =
    "h-16 rounded-xl border-2 border-orange-200 bg-white/90 pl-14 pr-4 text-lg text-slate-900 shadow-[0_10px_25px_rgba(15,23,42,0.06)] transition focus:border-orange-500 focus:ring-4 focus:ring-orange-200/60 md:text-xl";
  const iconClassName =
    "pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-orange-500";

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
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
              <Dialog.Panel className="w-full max-w-5xl rounded-t-[2.5rem] border border-white/50 bg-[linear-gradient(180deg,rgba(255,247,237,0.98),rgba(255,255,255,0.98))] pb-10 shadow-[0_-18px_50px_rgba(15,23,42,0.25)]">
                <div className="mx-auto mt-3 h-1.5 w-24 rounded-full bg-orange-200" />

                <div className="px-5 pb-8 pt-8 md:px-8 md:pb-20 md:pt-10">
                  <div className="mb-7 flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 via-orange-500 to-amber-400 text-white shadow-lg md:h-16 md:w-16">
                        <FiCreditCard className="text-2xl md:text-3xl" />
                      </div>
                      <div className="flex flex-col justify-center space-y-1 text-center md:text-left">
                        <Dialog.Title className="inter-bold text-xl leading-tight text-slate-900 md:text-3xl">
                          Check Balance
                        </Dialog.Title>
                        <p className="max-w-3xl text-sm text-slate-600 md:text-lg">
                          Select your office and enter your PIN to view the current office balance.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-orange-300 bg-white text-orange-500 shadow-sm transition hover:bg-orange-50 hover:text-orange-600"
                    >
                      <FiChevronDown className="text-2xl" />
                    </button>
                  </div>

                  <div className="grid gap-6 p-5 md:grid-cols-2">
                    <div className="md:col-span-2 rounded-[1.75rem] border border-orange-200/80 bg-white/80 p-5 shadow-[0_18px_35px_rgba(148,163,184,0.12)]">
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                          <FiBriefcase className="text-2xl" />
                        </div>
                        <div>
                          <p className="inter-semibold text-xl text-slate-900 md:text-2xl">
                            Office Balance Inquiry
                          </p>
                          <p className="mt-2 text-base text-slate-600">
                            This uses your office PIN to securely check the remaining balance.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label className="inter-semibold mb-3 flex items-center gap-2 text-lg text-slate-800 md:text-lg">
                        <span className="text-orange-500 uppercase">Office</span>
                      </Label>
                      <Select
                        value={selectedOfficeId}
                        onChange={onOfficeChange}
                        searchable
                        searchPlaceholder="Type to search office..."
                        emptyMessage="No office found."
                        icon={<FiBriefcase className="text-2xl" />}
                        placeholder={isOfficesLoading ? "Loading offices..." : "Select office"}
                        options={offices.map((office) => ({
                          label: office.name,
                          value: office.id,
                          description: office.description,
                        }))}
                        buttonClassName={inputClassName}
                      />
                      <InputError message={officeError} className="mt-2 text-base" />
                    </div>

                    <div className="md:col-span-2">
                      <Label className="inter-semibold mb-3 flex items-center gap-2 text-lg text-slate-800 md:text-lg">
                        <span className="text-orange-500 uppercase">PIN</span>
                      </Label>
                      <div className="relative">
                        <span className={iconClassName}>
                          <FiLock className="text-2xl" />
                        </span>
                        <Input
                          name="pin"
                          type="password"
                          className={inputClassName}
                          value={pin}
                          onChange={onPinChange}
                          placeholder="Enter office PIN"
                          autoComplete="off"
                        />
                      </div>
                      <InputError message={pinError} className="mt-2 text-base" />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col-reverse gap-3 px-5 md:flex-row">
                    <Button
                      type="button"
                      onClick={onClose}
                      className="h-16 flex-1 rounded-4xl border-2 border-slate-300 bg-white text-lg text-slate-700 shadow-sm hover:bg-slate-50 md:text-xl"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={onSubmit}
                      className="h-16 flex-[1.3] rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-lg text-white shadow-[0_14px_30px_rgba(234,88,12,0.25)] hover:from-orange-600 hover:to-amber-600 md:text-xl"
                      disabled={isLoading || isOfficesLoading}
                    >
                      {isLoading ? "Checking..." : "Check Balance Now"}
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default CheckBalanceDialog;
