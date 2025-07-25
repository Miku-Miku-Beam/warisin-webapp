"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProgramsSearchBarProps {
  search: string;
  category: string;
  categories: string[];
}

const ProgramsSearchBar = ({ search, category, categories }: ProgramsSearchBarProps) => {
  const [searchValue, setSearchValue] = useState(search || "");
  const [categoryValue, setCategoryValue] = useState(category || "All Program");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Update state if props change (for SSR navigation)
  useEffect(() => {
    setSearchValue(search || "");
  }, [search]);
  useEffect(() => {
    setCategoryValue(category || "All Program");
  }, [category]);

  function updateQuery(newSearch: string, newCategory: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (newSearch) params.set("search", newSearch);
    else params.delete("search");
    if (newCategory && newCategory !== "All Program") params.set("category", newCategory);
    else params.delete("category");
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-4">
      <label htmlFor="search-program" className="sr-only">Cari program</label>
      <div className="relative flex-1 w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
        </span>
        <input
          id="search-program"
          type="text"
          value={searchValue}
          onChange={e => {
            setSearchValue(e.target.value);
            updateQuery(e.target.value, categoryValue);
          }}
          placeholder="Cari program berdasarkan judul atau deskripsi..."
          className="pl-10 pr-10 bg-white/80 border border-gray-200 rounded-lg px-4 py-2 outline-none text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 transition w-full"
          autoComplete="off"
        />
        {searchValue && (
          <button
            type="button"
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={() => {
              setSearchValue("");
              updateQuery("", categoryValue);
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
      <label htmlFor="category-program" className="sr-only">Filter kategori</label>
      <select
        id="category-program"
        className="bg-white/80 border border-gray-200 rounded-lg px-3 py-2 outline-none text-gray-700 focus:ring-2 focus:ring-yellow-400 transition"
        value={categoryValue}
        onChange={e => {
          setCategoryValue(e.target.value);
          updateQuery(searchValue, e.target.value);
        }}
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
};

export default ProgramsSearchBar; 