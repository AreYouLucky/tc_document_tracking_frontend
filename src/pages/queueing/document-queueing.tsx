import QueueingLayout from "../../layouts/queueing-layout"
import { useState } from "react"
import CardTotal from "../../components/card-total"
function DocumentQueueing(){
    const [totals, setTotals] = useState({completed:0, pending:0})
    return (
        <QueueingLayout>
             <div className="grid md:grid-cols-2  gap-6">
                <div className="flex flex-col">
                    <div>

                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       
                        <CardTotal total={totals.completed} subtitle="Total Releasing" />
                        <CardTotal total={totals.pending} subtitle="Total Pending" />

                    </div>
                </div>
                <div>
                    
                </div>

             </div>
        </QueueingLayout>
    )
}

export default DocumentQueueing