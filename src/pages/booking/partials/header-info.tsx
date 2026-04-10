export default function HeaderInfo() {
    return (
        <header className="flex flex-col gap-4 rounded-[1.75rem] bg-linear-to-r from-orange-500 via-orange-500 to-amber-500 p-8 text-white shadow-xl">
            <div className="space-y-2">
                <h1 className="font-extrabold text-center text-3xl uppercase leading-tight md:text-4xl">
                    Submit Request for Document
                </h1>
                <p className="text-lg leading-relaxed text-orange-50 md:text-2xl text-center font-bold">
                    (Mag-request ug Dokumento)
                </p>
            </div>
        </header>
    )
}
