type Props = { total: number; page: number; pageSize: number; maxPage: number; };
export function Totals({ total, page, pageSize, maxPage }: Props) {
    return (
        <div className="justify-self-end self-end text-sm text-gray-700">
            {total
                ? <>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} • Page {page} of {maxPage}</>
                : "No results"}
        </div>
    );
}
