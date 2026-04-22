"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const videoWrap = videoWrapRef.current;
      if (!section || !videoWrap) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const startSize = videoWrap.offsetWidth;
      const scaleNeeded = (Math.max(vw, vh) / startSize) * 1.05;

      const header = document.querySelector("header");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 0.6,
        },
      });

      tl.fromTo(
        videoWrap,
        { scale: 1, borderRadius: "14px" },
        { scale: scaleNeeded, borderRadius: "0px", ease: "none", duration: 1 }
      );

      tl.to(videoWrap, {
        scale: 1,
        borderRadius: "14px",
        ease: "none",
        duration: 1,
      });

      if (header) {
        const headerTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=300%",
            scrub: 0.6,
          },
        });

        headerTl.to(header, {
          autoAlpha: 0,
          y: -40,
          ease: "none",
          duration: 0.3,
        });

        headerTl.to(
          header,
          { autoAlpha: 1, y: 0, ease: "none", duration: 0.3 },
          0.7
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="sobre" className="relative bg-white overflow-hidden h-screen">
      <div className="flex items-center justify-center h-full">
        <div
          ref={videoWrapRef}
          className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px] lg:w-[440px] lg:h-[440px] overflow-hidden shadow-lg shadow-primary/8"
          style={{ borderRadius: "14px" }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/video-sobre.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
