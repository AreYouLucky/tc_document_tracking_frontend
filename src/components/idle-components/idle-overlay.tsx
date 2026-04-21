import React from "react";
import { verses } from "../../defaults/data";
import { VerseCarousel } from "../verses-carousel";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const IdleOverlay: React.FC<Props> = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="rounded-4xl bg-orange-600 p-10 shadow-xl text-center">
        <VerseCarousel verses={verses} />

        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover mt-4 rounded-xl"
          src="/assets/video.mp4"
        />
      </div>
    </div>
  );
};