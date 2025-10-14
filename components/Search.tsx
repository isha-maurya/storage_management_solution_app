"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";

const Search = () => {
 const searchParams = useSearchParams();
 const router = useRouter();
 const path = usePathname();

  // Initialize state from URL on mount, and only on mount.
  const [query, setQuery] = useState(searchParams.get("query") || "");
 const [debouncedQuery] = useDebounce(query, 300);

  // This effect updates the URL when the debounced query changes.
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      params.set("query", debouncedQuery);
    } else {
      params.delete("query");
    }
    router.push(`${path}?${params.toString()}`);
  }, [debouncedQuery, path, router, searchParams]);

  // This effect syncs the local state if the URL is changed externally (e.g., back/forward buttons)
  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="Search..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;