"use client";

import * as React from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  anchorEl: HTMLElement | null;
  portalRoot?: HTMLElement | null;
  onClose: () => void;
  onSend: (blob: Blob, durationMs: number) => void;
};

export default function VoiceRecorder({
  open,
  anchorEl,
  portalRoot,
  onClose,
  onSend,
}: Props) {
  const [paused, setPaused] = React.useState(false);
  const [ms, setMs] = React.useState(0);
  const [hasAudio, setHasAudio] = React.useState(false);

  const streamRef = React.useRef<MediaStream | null>(null);
  const recRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<BlobPart[]>([]);
  const rafRef = React.useRef<number | null>(null);

  const startTimer = React.useCallback(() => {
    const startAt = performance.now() - ms;
    const tick = () => {
      setMs(performance.now() - startAt);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [ms]);

  const stopTimer = React.useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const cleanup = React.useCallback(() => {
    stopTimer();
    recRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    chunksRef.current = [];
    setMs(0);
    setPaused(false);
    setHasAudio(false);
  }, [stopTimer]);

  const pickMimeType = () => {
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/aac",
    ];
    for (const m of candidates) {
      // @ts-ignore
      if (
        typeof MediaRecorder !== "undefined" &&
        MediaRecorder.isTypeSupported?.(m)
      ) {
        return m;
      }
    }
    return undefined;
  };

  const start = React.useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mime = pickMimeType();
      const mr = new MediaRecorder(
        stream,
        mime ? { mimeType: mime } : undefined
      );
      recRef.current = mr;
      chunksRef.current = [];
      setHasAudio(false);

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
          setHasAudio(true);
        }
      };
      mr.onstop = () => stopTimer();

      mr.start(250);
      startTimer();
    } catch (e) {
      console.error("Microphone error:", e);
      onClose();
    }
  }, [onClose, startTimer, stopTimer]);

  React.useEffect(() => {
    if (!open) return;
    (async () => {
      await start();
    })();
    return () => cleanup();
  }, [open, start, cleanup]);

  const pause = () => {
    if (recRef.current?.state === "recording") {
      recRef.current.pause();
      setPaused(true);
      stopTimer();
    }
  };

  const resume = () => {
    if (recRef.current?.state === "paused") {
      recRef.current.resume();
      setPaused(false);
      startTimer();
    }
  };

  const redo = async () => {
    if (recRef.current && recRef.current.state !== "inactive")
      recRef.current.stop();
    chunksRef.current = [];
    setMs(0);
    setPaused(false);
    setHasAudio(false);
    await start();
  };

  const cancel = () => {
    if (recRef.current && recRef.current.state !== "inactive")
      recRef.current.stop();
    onClose();
  };

  const send = () => {
    const finish = () => {
      const inferredType =
        (recRef.current as any)?.mimeType ||
        (chunksRef.current[0] as any)?.type ||
        "audio/webm";
      const blob = new Blob(chunksRef.current, { type: inferredType });
      onSend(blob, ms);
      onClose();
    };
    if (recRef.current && recRef.current.state !== "inactive") {
      recRef.current.addEventListener("stop", finish, { once: true });
      recRef.current.stop();
    } else {
      finish();
    }
  };

  const mmss = React.useMemo(() => {
    const s = Math.floor(ms / 1000);
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${m}:${ss}`;
  }, [ms]);

  return (
    <BottomSheet
      open={open}
      onClose={cancel}
      anchorEl={anchorEl}
      portalRoot={portalRoot}
    >
      {/* Title */}
      <p className="px-2 pb-2 text-center text-sm font-medium text-gray-700">
        {paused ? "Paused" : "Recording..."}
      </p>

      {/* Pink bar: timer • waveform • send */}
      <div className="flex items-center gap-3 rounded-full bg-[#FEE9F5] p-3">
        <div className="text-xs font-semibold tabular-nums">{mmss}</div>

        {/* decorative waveform */}
        <div className="relative mx-1 flex h-8 flex-1 items-center gap-[2px]">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className={`w-[4px] rounded-sm bg-[#EB3FA5] ${
                paused ? "h-[6px]" : "animate-[pulse_1.2s_ease-in-out_infinite]"
              }`}
              style={{
                height: `${6 + ((i * 13) % 18)}px`,
                animationDelay: `${(i % 8) * 0.1}s`,
              }}
            />
          ))}
        </div>

        <Button
          onClick={send}
          disabled={!hasAudio || ms < 500}
          className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tl from-[#F92FA2] to-[#CA2CFF] p-0 text-white hover:opacity-90 disabled:opacity-40"
          aria-label="Send voice"
        >
          <img src={"/icons/PaperPlaneTilt.svg"} alt="Send" />
        </Button>
      </div>

      <div className="mt-3 grid grid-cols-3 items-center">
        {/* Delete — left */}
        <button
          onClick={cancel}
          className="justify-self-start rounded-full p-3 hover:bg-gray-100"
          aria-label="Discard recording"
          title="Discard"
        >
          <img src={"/icons/Trash.svg"} alt="" className="h-6 w-6" />
        </button>

        {/* Pause/Resume — center */}
        {paused ? (
          <button
            onClick={resume}
            className="justify-self-center rounded-full p-3 hover:bg-gray-100"
            aria-label="Resume recording"
            title="Resume"
          >
            <img src={"/icons/Play.svg"} alt="" className="h-6 w-6" />
          </button>
        ) : (
          <button
            onClick={pause}
            className="justify-self-center rounded-full p-3 hover:bg-gray-100"
            aria-label="Pause recording"
            title="Pause"
          >
            <img src={"/icons/Pause.svg"} alt="" className="h-6 w-6" />
          </button>
        )}

        {/* Redo — right */}
        <button
          onClick={redo}
          className="justify-self-end rounded-full p-3 hover:bg-gray-100"
          aria-label="Redo recording"
          title="Redo"
        >
          <img
            src={"/icons/ArrowCounterClockwiseGray.svg"}
            alt=""
            className="h-6 w-6"
          />
        </button>
      </div>
    </BottomSheet>
  );
}
