import { Dialog, Transition } from "@headlessui/react";
import { Fragment, type ReactNode } from "react";

type ModalProps = {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ show, onClose, children }: ModalProps) {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md rounded-lg bg-transparent">
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>

      </Dialog>
    </Transition>
  );
}
