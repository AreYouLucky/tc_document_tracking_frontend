import QueueingLayout from "../../layouts/queueing-layout"
import { useState } from "react"
import CardTotal from "../../components/card-total"
import ReleasingTable from "./partials/releasing-table"
import PendingTable from "./partials/pending-table"

function DocumentQueueing(){

    const [completed, setCompleted] = useState(0)
    const [pending, setPending] = useState(0)
    return (
        <QueueingLayout>
             <div className="grid md:grid-cols-2  gap-6 py-4">
                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-2xl px-8 pb-5 pt-5 ">
                        <p className="text-orange-600 inter-bold text-center text-3xl py-2">
                            Pending
                        </p>
                        <PendingTable setPending={setPending} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <CardTotal total={completed} subtitle="Total Releasing" />
                        <CardTotal total={pending} subtitle="Total Pending" />
                    </div>
                </div>
                <div>
                    <div className="bg-white rounded-2xl px-8 pb-5 pt-5 ">
                        <p className="text-orange-600 inter-bold text-center text-3xl py-2">
                            Releasing
                        </p>
                        <ReleasingTable setCompleted={setCompleted} />
                    </div>
                </div>

             </div>
        </QueueingLayout>
    )
}

export default DocumentQueueing