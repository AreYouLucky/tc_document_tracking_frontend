import QueueingLayout from "../../layouts/queueing-layout"
import { useState, useRef, useEffect, useMemo } from "react"
import CardTotal from "../../components/card-total"
import ReleasingTable from "./partials/releasing-table"
import PendingTable from "./partials/pending-table"
import { type QueuesTransactionModel } from "../../types/models"
import { getItemKey, getItemIdentityKey, buildSpeechText, } from "./partials/queueing-hooks"


function DocumentQueueing() {

    const [completed, setCompleted] = useState<QueuesTransactionModel[]>([])
    const [pending, setPending] = useState<QueuesTransactionModel[]>([])
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [speechQueue, setSpeechQueue] = useState<QueuesTransactionModel[]>([]);
    const isSpeakingRef = useRef(false);
    const readCountsRef = useRef<Map<string, number>>(new Map());
    const [speechEnabled, setSpeechEnabled] = useState(false);

    const incomingData = useMemo(
        () => [...pending, ...completed],
        [pending, completed]
    );

    useEffect(() => {
        setSpeechQueue(prevQueue => {
            const latestItemsByIdentity = new Map<string, QueuesTransactionModel>();

            incomingData.forEach(item => {
                latestItemsByIdentity.set(getItemIdentityKey(item), item);
            });

            const latestKeys = new Set(
                Array.from(latestItemsByIdentity.values()).map(getItemKey)
            );

            const activeQueue = prevQueue.filter(item => latestKeys.has(getItemKey(item)));
            const queuedKeys = new Set(activeQueue.map(getItemKey));

            const updatedQueueItems = Array.from(latestItemsByIdentity.values()).filter(item => {
                const itemKey = getItemKey(item);
                return !queuedKeys.has(itemKey) && (readCountsRef.current.get(itemKey) ?? 0) < 2;
            });

            if (activeQueue.length === prevQueue.length && updatedQueueItems.length === 0) {
                return prevQueue;
            }

            return updatedQueueItems.length > 0 ? [...activeQueue, ...updatedQueueItems] : activeQueue;
        });
    }, [incomingData])

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

        const itemKey = getItemKey(currentItem);
        const speakText = buildSpeechText(currentItem);
        const utterance = new SpeechSynthesisUtterance(speakText);

        utterance.rate = 0.7;
        utterance.pitch = 1;
        utterance.volume = 1;

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        const handleFinish = () => {
            const nextReadCount = (readCountsRef.current.get(itemKey) ?? 0) + 1;
            readCountsRef.current.set(itemKey, nextReadCount);
            isSpeakingRef.current = false;

            setSpeechQueue(prevQueue => {
                const finishedItemIndex = prevQueue.findIndex(item => getItemKey(item) === itemKey);

                if (finishedItemIndex === -1) {
                    return prevQueue;
                }

                const nextQueue = [...prevQueue];
                const [finishedItem] = nextQueue.splice(finishedItemIndex, 1);

                if (nextReadCount < 2 && finishedItem) {
                    return [...nextQueue, finishedItem];
                }

                return nextQueue;
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

    useEffect(() => {
        const unlock = () => {
            setSpeechEnabled(true);
            speechSynthesis.speak(new SpeechSynthesisUtterance(""));
            window.removeEventListener("click", unlock);
        };

        window.addEventListener("click", unlock);

        return () => window.removeEventListener("click", unlock);
    }, []);

    return (
        <QueueingLayout>
            <div className="grid md:grid-cols-2  gap-6 py-4">
                <div className="flex flex-col gap-4">
                    <div className="bg-white/90 rounded-2xl px-8 pb-5 pt-5 ">
                        <p className="text-orange-600 inter-bold text-center text-3xl py-2">
                            Pending
                        </p>
                        <PendingTable pending={pending} setPending={setPending} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <CardTotal total={completed.length} subtitle="Total Releasing" />
                        <CardTotal total={pending.length} subtitle="Total Pending" />
                    </div>
                </div>
                <div>
                    <div className="bg-white/90 rounded-2xl px-8 pb-5 pt-5 ">
                        <p className="text-orange-600 inter-bold text-center text-3xl py-2">
                            Releasing
                        </p>
                        <ReleasingTable completed={completed} setCompleted={setCompleted} />
                    </div>
                </div>

            </div>
        </QueueingLayout>
    )
}

export default DocumentQueueing
