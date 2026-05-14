import { Fragment, useEffect, useRef, useState } from "react";
import { Combobox, Listbox, Transition } from "@headlessui/react";
import { FiCheck, FiChevronDown, FiSearch } from "react-icons/fi";

type SelectOption = {
  label: string;
  value: string;
  description?: string;
};

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  icon?: React.ReactNode;
  buttonClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
  wrapperClassName?: string;
};

function Select({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  searchable = false,
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  icon,
  buttonClassName = "",
  optionsClassName = "",
  optionClassName = "",
  wrapperClassName = "",
}: SelectProps) {
  const selectedOption = options.find((option) => option.value === value);
  const [query, setQuery] = useState("");
  const comboboxButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!searchable) {
      setQuery("");
      return;
    }

    if (selectedOption) {
      setQuery(selectedOption.label);
    } else if (!value) {
      setQuery("");
    }
  }, [searchable, selectedOption, value]);

  const normalizedQuery = query.trim().toLowerCase();
  const selectedLabel = selectedOption?.label.trim().toLowerCase() ?? "";
  const isShowingSelectedLabel = Boolean(selectedLabel) && normalizedQuery === selectedLabel;
  const filteredOptions =
    searchable && normalizedQuery && !isShowingSelectedLabel
      ? options.filter((option) => {
        const haystack = `${option.label} ${option.description ?? ""}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      : options;

  if (searchable) {
    return (
      <Combobox
        value={value}
        onChange={(nextValue: string | null) => {
          onChange(nextValue ?? "");
        }}
      >
        {({ open }) => (
          <div className={`relative ${wrapperClassName}`}>
            <div className="relative">
              {icon ? (
                <span className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-orange-500">
                  {icon}
                </span>
              ) : null}
              <Combobox.Input
                className={`monst-regular relative flex h-16 w-full items-center rounded-xl border-2 border-orange-200 bg-white/90 pl-14 pr-14 text-left text-lg text-slate-900 shadow-[0_10px_25px_rgba(15,23,42,0.06)] transition focus:border-orange-500 focus:ring-4 focus:ring-orange-200/60 focus:outline-none md:text-xl ${buttonClassName}`}
                displayValue={() => query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => {
                  if (!open) {
                    comboboxButtonRef.current?.click();
                  }
                }}
                placeholder={selectedOption ? selectedOption.label : placeholder}
                autoComplete="off"
              />
              <Combobox.Button
                ref={comboboxButtonRef}
                className="absolute inset-y-0 right-0 flex w-14 items-center justify-center text-orange-500 focus:outline-none"
              >
                {normalizedQuery && !isShowingSelectedLabel ? (
                  <FiSearch className="text-xl" />
                ) : (
                  <FiChevronDown className="text-xl" />
                )}
              </Combobox.Button>
            </div>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => {
                if (selectedOption) {
                  setQuery(selectedOption.label);
                } else {
                  setQuery("");
                }
              }}
            >
              <Combobox.Options
                className={`absolute z-50 mt-3 max-h-72 w-full overflow-auto rounded-2xl border border-orange-100 bg-white p-2 shadow-[0_20px_40px_rgba(15,23,42,0.16)] focus:outline-none ${optionsClassName}`}
              >
                <div className="px-3 pb-2 text-sm text-slate-400">
                  {searchPlaceholder}
                </div>
                {filteredOptions.length === 0 ? (
                  <div className="rounded-xl px-4 py-3 text-base text-slate-500">
                    {emptyMessage}
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <Combobox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active }) =>
                        `relative cursor-pointer rounded-xl px-4 py-3 pr-10 transition ${active ? "bg-orange-50 text-orange-700" : "text-slate-700"
                        } ${optionClassName}`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <div className="flex flex-col">
                            <span className={`text-base ${selected ? "inter-semibold" : "inter-regular"}`}>
                              {option.label}
                            </span>
                            {option.description ? (
                              <span className="mt-1 text-sm text-slate-500">{option.description}</span>
                            ) : null}
                          </div>
                          {selected ? (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500">
                              <FiCheck className="text-lg" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        )}
      </Combobox>
    );
  }

  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative ${wrapperClassName}`}>
        <Listbox.Button
          className={`monst-regular relative flex h-16 w-full items-center rounded-xl border-2 border-orange-200 bg-white/90 pl-14 pr-14 text-left text-lg text-slate-900 shadow-[0_10px_25px_rgba(15,23,42,0.06)] transition focus:border-orange-500 focus:ring-4 focus:ring-orange-200/60 focus:outline-none md:text-xl ${buttonClassName}`}
        >
          {icon ? (
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-orange-500">
              {icon}
            </span>
          ) : null}
          <span className={selectedOption ? "text-slate-900" : "text-slate-400"}>
            {selectedOption?.label ?? placeholder}
          </span>
          <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-orange-500">
            <FiChevronDown className="text-xl" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className={`absolute z-50 mt-3 max-h-72 w-full overflow-auto rounded-2xl border border-orange-100 bg-white p-2 shadow-[0_20px_40px_rgba(15,23,42,0.16)] focus:outline-none ${optionsClassName}`}
          >
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  `relative cursor-pointer rounded-xl px-4 py-3 pr-10 transition ${active ? "bg-orange-50 text-orange-700" : "text-slate-700"
                  } ${optionClassName}`
                }
              >
                {({ selected }) => (
                  <>
                    <div className="flex flex-col">
                      <span className={`text-base ${selected ? "inter-semibold" : "inter-regular"}`}>
                        {option.label}
                      </span>
                      {option.description ? (
                        <span className="mt-1 text-sm text-slate-500">{option.description}</span>
                      ) : null}
                    </div>
                    {selected ? (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500">
                        <FiCheck className="text-lg" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

export { Select };
export type { SelectOption };
