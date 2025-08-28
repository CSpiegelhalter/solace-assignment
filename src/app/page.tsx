"use client";

import "./advocates/advocates.css";

import { useAdvocates } from "./advocates/hooks/useAdvocates";
import { SearchInput } from "./advocates/components/Controls/SearchInput";
import { PageSizeSelect } from "./advocates/components/Controls/PageSizeSelect";
import { Totals } from "./advocates/components/Controls/Totals";
import { Info, Error as ErrorAlert } from "./advocates/components/Status/Alert";
import { MobileCardList } from "./advocates/components/MobileList/MobileCardList";
import { AdvocateTable } from "./advocates/components/DesktopTable/AdvocateTable";
import { Pagination } from "./advocates/components/Pagination/Pagination";
import { Header } from "./advocates/components/Header";

export default function Page() {
  const {
    advocates, searchTerm, setSearchTerm,
    loading, error,
    page, setPage, pageSize, setPageSize, total, maxPage,
    goTo,
  } = useAdvocates();

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6">
      <Header />

      {/* Controls */}
      <section className="mt-2 grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <SearchInput value={searchTerm} onChange={setSearchTerm} />
        <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
        <Totals total={total} page={page} pageSize={pageSize} maxPage={maxPage} />
      </section>

      {/* Status */}
      {loading && <Info>Loading…</Info>}
      {error && <ErrorAlert>{error}</ErrorAlert>}

      {/* Lists */}
      <MobileCardList advocates={advocates} loading={loading} />
      <AdvocateTable advocates={advocates} loading={loading} />

      {/* Pagination */}
      <Pagination page={page} maxPage={maxPage} goTo={goTo} />
    </main>
  );
}
