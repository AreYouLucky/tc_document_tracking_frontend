import { type ReactNode } from "react";
import Header from "../components/header";
type Props = {
    children: ReactNode;
    className?: string;
}
function QueueingLayout({ children, className, }: Props) {

    return (
        <div
            className={`relative min-h-screen print:hidden ${className}`}
            style={{
                backgroundImage: `url('/assets/background.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-linear-to-b from-yellow-500/90 to-orange-500/90"></div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 flex justify-center items-start px-4 md:px-8 lg:px-16">
                    <div className="w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default QueueingLayout;
