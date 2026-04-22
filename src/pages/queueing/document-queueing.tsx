import QueueingLayout from "../../layouts/queueing-layout"
import { useState, useRef, useEffect } from "react"
import ReleasingTable from "./partials/releasing-table"
import PendingTable from "./partials/pending-table"
import { type QueuesTransactionModel } from "../../types/models"
import { echo } from "../../utils/echo"
import { type TtsModel } from "../../types/models"

type TtsQueueItem = {
    id: number;
    tts_message: string;
    readCount: number;
}

function DocumentQueueing() {

    const [completed, setCompleted] = useState<QueuesTransactionModel[]>([])
    const [pending, setPending] = useState<QueuesTransactionModel[]>([])
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [speechQueue, setSpeechQueue] = useState<TtsQueueItem[]>([]);
    const isSpeakingRef = useRef(false);
    const nextTtsIdRef = useRef(1);
    const [speechEnabled, setSpeechEnabled] = useState(false);
    const [showStartOverlay, setShowStartOverlay] = useState(true);


    useEffect(() => {
        const channel = echo.channel("queue-channel");

        channel.listen(".queue.broadcast", (e: TtsModel) => {
            const message = e.message?.trim();
            console.log(e);
            if (!message) {
                return;
            }

            setSpeechQueue(prevQueue => [
                ...prevQueue,
                {
                    id: nextTtsIdRef.current++,
                    tts_message: message,
                    readCount: 0,
                },
            ]);
        });

        return () => {
            echo.leave("queue-channel");
        };
    }, []);

    useEffect(() => {
        const pickFemaleVoice = () => {
            const voices = speechSynthesis.getVoices();

            if (voices.length === 0) {
                return;
            }

            const femaleVoice =
                voices.find(voice =>
                    /female|zira|hazel|susan|aria|samantha|karen|moira|jenny/i.test(voice.name)
                ) ??
                voices.find(voice => /en-/i.test(voice.lang)) ??
                voices[0];

            setSelectedVoice(femaleVoice ?? null);
        };

        pickFemaleVoice();
        speechSynthesis.onvoiceschanged = pickFemaleVoice;

        return () => {
            speechSynthesis.onvoiceschanged = null;
        };
    }, []);


    useEffect(() => {
        if (!speechEnabled) return;

        if (speechQueue.length === 0 || isSpeakingRef.current) {
            return;
        }

        const currentItem = speechQueue[0];
        if (!currentItem) {
            return;
        }

        isSpeakingRef.current = true;

        const utterance = new SpeechSynthesisUtterance(currentItem.tts_message);

        utterance.rate = 0.7;
        utterance.pitch = 1;
        utterance.volume = 1;

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        const handleFinish = () => {
            isSpeakingRef.current = false;

            setSpeechQueue(prevQueue => {
                const [finishedItem, ...remainingQueue] = prevQueue;

                if (!finishedItem || finishedItem.id !== currentItem.id) {
                    return prevQueue;
                }

                const nextReadCount = finishedItem.readCount + 1;
                if (nextReadCount >= 2) {
                    return remainingQueue;
                }

                return [
                    {
                        ...finishedItem,
                        readCount: nextReadCount,
                    },
                    ...remainingQueue,
                ];
            });
        };

        utterance.onend = handleFinish;
        utterance.onerror = handleFinish;

        speechSynthesis.speak(utterance);
    }, [speechQueue, selectedVoice, speechEnabled]);

    useEffect(() => {
        return () => {
            speechSynthesis.cancel();
        };
    }, []);

    const handleStartQueueing = () => {
        setSpeechEnabled(true);
        speechSynthesis.speak(new SpeechSynthesisUtterance(""));
        setShowStartOverlay(false);
    };

    return (
        <QueueingLayout>
            {showStartOverlay ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">

                    <button
                        type="button"
                        onClick={handleStartQueueing}
                        className="font-extrabold rounded-full bg-linear-to-r from-orange-500 to-amber-500 px-15 py-3 text-6xl text-white shadow-[0_18px_35px_rgba(234,88,12,0.28)] transition-transform duration-200 hover:scale-[1.02] uppercase inter-bold border-4 border-white"
                    >
                        Start
                    </button>

                </div>
            ) : null}

            <div className="grid md:grid-cols-2 gap-6 py-4">
                <div className="flex flex-col gap-4">
                    <div className="bg-white/90 rounded-2xl px-8 pb-5 pt-5 ">
                        <p className="text-orange-600 inter-bold text-center text-4xl py-2 uppercase">
                            Pending
                        </p>
                        <PendingTable pending={pending} setPending={setPending} />
                    </div>
                    {/* <div className="grid grid-cols-2 gap-6">
                        <CardTotal total={completed.length} subtitle="Total Releasing" />
                        <CardTotal total={pending.length} subtitle="Total Pending" />
                    </div> */}
                </div>
                <div>
                    <div className="bg-white/90 rounded-2xl px-8 pb-5 pt-5 ">
                        <p className="text-orange-600 inter-bold text-center text-4xl py-2 uppercase">
                            Release
                        </p>
                        <ReleasingTable completed={completed} setCompleted={setCompleted} />
                    </div>
                </div>

            </div>
        </QueueingLayout>
    )
}

export default DocumentQueueing
