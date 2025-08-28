import type { Advocate } from "../../types";
import { Pill } from "./Pill";

export function TableRow({ a, alt }: { a: Advocate; alt: boolean; }) {
    return (
        <tr className={alt ? "row-alt" : "row"}>
            <td className="td">{a.firstName}</td>
            <td className="td">{a.lastName}</td>
            <td className="td">{a.city}</td>
            <td className="td">{a.degree}</td>
            <td className="td">
                <div className="flex max-w-md flex-wrap gap-1.5">
                    {a.specialties.map((s) => <Pill key={s}>{s}</Pill>)}
                </div>
            </td>
            <td className="td whitespace-nowrap">{a.yearsOfExperience}</td>
            <td className="td">
                <a href={`tel:${a.phoneNumber}`} className="link">{a.phoneNumber}</a>
            </td>
        </tr>
    );
}
