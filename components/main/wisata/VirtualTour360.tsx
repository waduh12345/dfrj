"use client";

import { useEffect, useRef } from "react";
import PhotoSphereViewer from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";

export default function VirtualTour360({
  imageUrl,
  onLoad,
}: {
  imageUrl: string;
  onLoad?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerInstanceRef = useRef<PhotoSphereViewer.Viewer | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!containerRef.current) return;

      // Destroy instance lama
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.destroy();
        viewerInstanceRef.current = null;
      }

      try {
        const viewer = new PhotoSphereViewer.Viewer({
          container: containerRef.current,
          panorama: imageUrl,
          navbar: ["zoom", "fullscreen"],
          defaultLat: 0.3,
        });

        viewerInstanceRef.current = viewer;

        viewer.once("ready", () => {
          if (onLoad) onLoad();
        });
      } catch (err) {
        console.error("Error saat membuat viewer:", err);
      }
    }, 50); // Delay 50ms agar container siap

    return () => {
      clearTimeout(timeout);
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.destroy();
        viewerInstanceRef.current = null;
      }
    };
  }, [imageUrl, onLoad]);

  return <div ref={containerRef} className="w-full h-[500px]" />;
}