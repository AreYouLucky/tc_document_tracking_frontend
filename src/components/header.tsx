import { useEffect,useState } from "react";
export default function Header() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="flex justify-between items-center pt-4 px-16">
            <div className="flex flex-col gap-2">
                <span className="inter-bold text-3xl md:x-5xl text-white">
                    Document Queueing System
                </span>

                <span className="inter-bold text-[13px] lg:text-[15px] rounded-lg w-fit text-white">
                    {now.toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}{" "}
                    | {now.toLocaleTimeString()}
                </span>
            </div>

            <img
                src="/assets/tc-logo.png"
                alt="Logo"
                className="h-12 md:h-18"
            />
        </header>

    )
}