"use client";
import { useEffect, useMemo, useState } from "react";
import type { AdvocatesResponse, Advocate } from "../types";

export function useAdvocates() {
    const [advocates, setAdvocates] = useState<Advocate[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    // Debounce
    useEffect(() => {
        const id = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 300);
        return () => clearTimeout(id);
    }, [searchTerm]);

    // Max page derived
    const maxPage = useMemo(
        () => (total > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1),
        [total, pageSize]
    );

    // Clamp page if total/pageSize changes
    useEffect(() => {
        if (page > maxPage) setPage(maxPage);
    }, [maxPage, page]);

    // Fetch
    useEffect(() => {
        const ac = new AbortController();
        (async () => {
            try {
                setLoading(true);
                setError(null);

                const params = new URLSearchParams();
                if (debouncedTerm) params.set("term", debouncedTerm);
                params.set("page", String(page));
                params.set("pageSize", String(pageSize));

                const res = await fetch(`/api/advocates?${params}`, { signal: ac.signal });
                if (!res.ok) throw new Error(`Request failed: ${res.status}`);
                const data: AdvocatesResponse = await res.json();

                setAdvocates(data.items);
                setTotal(data.total);
            } catch (e: any) {
                if (e?.name !== "AbortError") setError("Failed to load advocates.");
            } finally {
                setLoading(false);
            }
        })();
        return () => ac.abort();
    }, [page, pageSize, debouncedTerm]);

    const goTo = (p: number) => setPage(Math.min(Math.max(1, p), maxPage));

    return {
        advocates,
        searchTerm, setSearchTerm,
        loading, error,
        page, setPage, pageSize, setPageSize, total, maxPage,
        goTo,
    };
}
