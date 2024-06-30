import React, { FunctionComponent, PropsWithChildren, useState } from "react";

import { api } from "~/utils/api";

export default function Home() {
  const [city, setCity] = useState("");
  const [object, setObject] = useState("");
  const [content, setContent] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex gap-1">
        <input
          type="text"
          onChange={(ev) => setCity(ev.target.value)}
          placeholder="city/generic"
        />
        <input
          type="text"
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="address"
        />
        <input
          type="text"
          onChange={(ev) => setObject(ev.target.value)}
          placeholder="object"
        />
        <input
          type="text"
          onChange={(ev) => setContent(ev.target.value)}
          placeholder="content"
        />
      </div>
      <div className="flex gap-1">
        <SearchResult input={city} />
        <AdvancedSearchResult
          object={object}
          content={content}
          address={address}
          city={city}
        />
      </div>
    </div>
  );
}

const SearchResult: FunctionComponent<
  { input: string } & PropsWithChildren
> = ({ input }) => {
  const { data, isLoading, isError, error } = api.post.search.useQuery(
    { text: input },
    { refetchInterval: 30000, refetchOnWindowFocus: false },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return (
      <div className="text-xl text-red-500">
        <div>Error:</div>
      </div>
    );
  }

  return (
    <div>
      <h2>NormalSearch results:</h2>
      <div className="flex flex-col gap-2">
        {data?.map((post) => {
          return (
            <div>
							<h3 className="font-mono text-xl">{post.city}</h3>
              <h4>
                <span className="text-yellow-300">{post.createdBy.name}</span> - {post.object}
              </h4>
              <h5 className="text-neutral-400">{post.content}</h5>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AdvancedSearchResult: FunctionComponent<
  {
    object?: string;
    content?: string;
    address?: string;
    city?: string;
  } & PropsWithChildren
> = ({ address, city, content, object }) => {
  const { data, isLoading, isError, error } = api.post.advancedSearch.useQuery(
    { object, content, address, city },
    { refetchInterval: 30000, refetchOnWindowFocus: false },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return (
      <div className="text-xl text-red-500">
        <div>Error:</div>
      </div>
    );
  }

  return (
    <div>
      <h2>AdvancedSearch results:</h2>
      <div className="flex flex-col gap-2">
        {data?.map((post) => {
          return (
            <div>
							<h3 className="font-mono text-xl">{post.city} - <span className="text-sm">{post.address}</span></h3>
              <h4>
                <span className="text-yellow-300">{post.createdBy.name}</span> - {post.object}
              </h4>
              <h5 className="text-neutral-400">{post.content}</h5>
            </div>
          );
        })}
      </div>
    </div>
  );
};
