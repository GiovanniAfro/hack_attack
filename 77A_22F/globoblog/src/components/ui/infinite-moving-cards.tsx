"use client";

import { cn } from "~/lib/utils";
import React, { FunctionComponent, useEffect, useState } from "react";
import { CardPreview } from "~/Dashboard/CardPreview";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Button } from "./button";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export type InfiniteMovingCardsProps = {
  items: inferRouterOutputs<AppRouter>["post"]["search"] | undefined[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
};

export const InfiniteMovingCards: FunctionComponent<
  InfiniteMovingCardsProps
> = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20  max-w-full overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          " flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (

              <li
                className="relative h-full w-[350px] max-w-full flex-shrink-0 rounded-2xl border border-b-0 border-slate-700 md:w-[450px]"
                style={{
                  background:
                  "linear-gradient(180deg, var(--slate-800), var(--slate-900)",
                }}
                key={idx}
                >
                <blockquote>
                  <div
                    aria-hidden="true"
                    className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-full w-[calc(100%_+_4px)]"
                    ></div>
                  <CardPreview post={item}></CardPreview>
                </blockquote>
              </li>
        ))}
      </ul>
    </div>
  );
};
