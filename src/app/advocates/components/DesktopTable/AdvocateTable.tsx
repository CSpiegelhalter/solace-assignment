import type { Advocate } from "../../types";
import { TableHead } from "./TableHead";
import { TableRow } from "./TableRow";

export function AdvocateTable({ advocates, loading }: { advocates: Advocate[]; loading: boolean; }) {
    return (
        <div className="mt-6 hidden overflow-x-auto sm:block">
            <table className="table">
                <TableHead />
                <tbody>
                    {advocates.map((a, i) => <TableRow key={a.id} a={a} alt={i % 2 === 1} />)}
                    {!advocates.length && !loading && (
                        <tr>
                            <td colSpan={7} className="td py-6 text-center text-gray-600">Nothing to show yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
