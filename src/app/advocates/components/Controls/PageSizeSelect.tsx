type Props = {
    pageSize: number;
    setPageSize: (n: number) => void;
};

export function PageSizeSelect({ pageSize, setPageSize }: Props) {
    return (
        <div className="sm:w-48">
            <label htmlFor="pageSize" className="mb-1 block text-sm font-medium">Rows per page</label>
            <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="select"
            >
                {[5, 10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
        </div>
    );
}
