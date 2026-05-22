"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, Search, X } from "lucide-react";

export function ClaimSearchForm({ value }: { value?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(value ?? "");

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const trimmed = query.trim();

    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }

    const nextQuery = params.toString();
    router.push(nextQuery ? `/claims?${nextQuery}` : "/claims");
  }

  function clearSearch() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    setQuery("");

    const nextQuery = params.toString();
    router.push(nextQuery ? `/claims?${nextQuery}` : "/claims");
  }

  return (
    <form
      onSubmit={submitSearch}
      className="mb-5 flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-gray-500"
    >
      <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="클레임 통합검색"
        className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-500"
      />
      {query ? (
        <button
          type="button"
          onClick={clearSearch}
          className="flex h-6 w-6 items-center justify-center rounded-sm text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
          aria-label="검색어 지우기"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : (
        <Camera className="h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
      )}
    </form>
  );
}
