type CardTotalProps = {
  total: number
  subtitle: string
}

export default function CardTotal({ total, subtitle }: CardTotalProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2
                    bg-white
                    rounded-4xl p-6 shadow-lg border-2 border-orange-400
                    transition-transform duration-200 hover:scale-[1.02]">
      
      <div className="text-4xl text-gray-700 inter-bold">
        {total}
      </div>

      <div className="w-28 h-1 rounded-full bg-orange-400"></div>

      <div className="text-lg uppercase tracking-wide text-gray-700 inter-bold">
        {subtitle}
      </div>
    </div>
  )
}
