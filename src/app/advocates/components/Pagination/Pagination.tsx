type Props = {
    page: number;
    maxPage: number;
    goTo: (p: number) => void;
};
export function Pagination({ page, maxPage, goTo }: Props) {
    return (
        <nav aria-label="Pagination" className="mt-6 flex flex-wrap items-center gap-2">
            <div className="ml-auto" />
            <button onClick={() => goTo(1)} disabled={page === 1} aria-label="First page" className="btn">« First</button>
            <button onClick={() => goTo(page - 1)} disabled={page === 1} aria-label="Previous page" className="btn">‹ Prev</button>
            <span className="px-2 text-sm text-gray-700">Page {page} of {maxPage}</span>
            <button onClick={() => goTo(page + 1)} disabled={page === maxPage} aria-label="Next page" className="btn">Next ›</button>
            <button onClick={() => goTo(maxPage)} disabled={page === maxPage} aria-label="Last page" className="btn">Last »</button>
        </nav>
    );
}
