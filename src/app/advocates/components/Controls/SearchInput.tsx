type Props = {
    value: string;
    onChange: (v: string) => void;
};
export function SearchInput({ value, onChange }: Props) {
    return (
        <div className="w-full">
            <label htmlFor="search" className="mb-1 block text-sm font-medium">Search</label>
            <div className="relative">
                <input
                    id="search"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Name, city, degree, specialty…"
                    className="input pr-24"
                />
                {value && (
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="btn-ghost absolute right-2 top-1/2 -translate-y-1/2"
                        aria-label="Clear search"
                    >
                        Clear
                    </button>
                )}
            </div>
            <p className="mt-1 text-xs text-gray-500 sm:hidden">
                Searching for: <span className="font-medium">{value || "—"}</span>
            </p>
        </div>
    );
}
