import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { FunctionComponent } from "react";
import { Button } from "~/components/ui/button";
import { World } from "~/components/ui/globe";
import { GlobeDemo } from "~/components/ui/globobo";
import { InfiniteMovingCards } from "~/components/ui/infinite-moving-cards";

import { api } from "~/utils/api";


export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center ">
      <div className="absolute w-full ">
        <GlobeDemo></GlobeDemo>
      </div>
      <div className="h-full w-full justify-center space-y-8">
        <LatestPostsMovingCards title="Ultimi 10 post" direction="left" />

        <LatestPostsMovingCards
          title="Roma"
          direction="right"
          query={{ city: "Rome" }}
        />
        <LatestPostsMovingCards
          title="Firenze"
          direction="left"
          query={{ city: "Florence" }}
        />
      </div>
    </div>
  );
}

const LatestPostsMovingCards: FunctionComponent<{
  direction: "right" | "left";
  title: string;
  query?: { city: string };
}> = ({ direction, title, query }) => {
  const { data, isLoading, error, isError } = api.post.getLatest10.useQuery(
    query ?? {},
    { refetchOnWindowFocus: false},
  );

  if (isLoading || isError) {
    return (
      <div className="w-full px-5 py-2">
        <h1
          className={`font-sans text-2xl sm:text-3xl lg:text-4xl ${direction == "right" ? "text-left " : "text-right"}`}
        >
          {title}
        </h1>
        <InfiniteMovingCards
          items={[
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
          ]}
          direction={direction}
          className="text-xs sm:text-sm lg:text-base"
          speed="normal"
        />
      </div>
    );
  }
  if (!data) {
    return null;
  }

  return (
    <div className="w-full px-5 py-2">
      <h1
        className={`font-sans text-2xl sm:text-3xl lg:text-4xl ${direction == "right" ? "text-left " : "text-right"}`}
      >
        {title}
      </h1>
      <InfiniteMovingCards
        items={data}
        direction={direction}
        className="text-xs sm:text-sm lg:text-base"
        speed="normal"
      />
    </div>
  );
};
