"use client";

// "use client" — IntersectionObserver + matchMedia to play silent loops
// only while on screen, and never autoplay for reduced-motion users
// (they get a normal player with controls instead).
//
// Uploaded file → <video>. YouTube link (no file) → privacy-enhanced
// youtube-nocookie embed, loaded lazily.

import { useEffect, useRef, useState } from "react";
import type { ProductVideoMedia } from "@/lib/types";

function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.hostname.endsWith("youtube.com")) {
      if (u.pathname.startsWith("/shorts/") || u.pathname.startsWith("/embed/"))
        return u.pathname.split("/")[2] ?? null;
      return u.searchParams.get("v");
    }
  } catch {
    /* invalid URL */
  }
  return null;
}

export default function VideoClip({
  video,
  className = "",
  rounded,
}: {
  video: ProductVideoMedia;
  className?: string;
  rounded?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const autoLoop = video.loop && !reduced;

  useEffect(() => {
    const el = ref.current;
    if (!el || !autoLoop) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [autoLoop]);

  if (!video.url && video.youtubeUrl) {
    const id = youtubeId(video.youtubeUrl);
    if (!id) return null;
    return (
      <iframe
        className={`w-full h-full ${className}`}
        style={{ border: 0, borderRadius: rounded }}
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
        title={video.alt}
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      />
    );
  }

  if (!video.url) return null;

  return (
    <video
      ref={ref}
      className={`w-full h-full object-cover ${className}`}
      style={{ borderRadius: rounded }}
      src={video.url}
      poster={video.poster}
      aria-label={video.alt}
      playsInline
      muted={autoLoop}
      loop={autoLoop}
      controls={!autoLoop}
      preload={autoLoop ? "metadata" : "none"}
    />
  );
}
