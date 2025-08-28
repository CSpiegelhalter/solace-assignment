import type { Advocate } from "../../types";

export function MobileCard({ a }: { a: Advocate }) {
    return (
        <li className="card p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-base font-semibold">{a.firstName} {a.lastName}</h3>
                    <p className="text-sm text-gray-600">{a.degree} • {a.city}</p>
                    <p className="mt-1 text-xs text-gray-500">
                        {a.yearsOfExperience} year{Number(a.yearsOfExperience) === 1 ? "" : "s"} experience
                    </p>
                </div>
                <a href={`tel:${a.phoneNumber}`} className="btn">Call</a>
            </div>

            {!!a.specialties?.length && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {a.specialties.map((s) => <span key={s} className="pill">{s}</span>)}
                </div>
            )}
        </li>
    );
}
