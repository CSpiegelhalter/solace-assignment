import type { Advocate } from "../../types";
import { MobileCard } from "./MobileCard";

export function MobileCardList({
    advocates,
    loading,
  }: { advocates: Advocate[]; loading: boolean }) {
    return (
      <ul role="list" className="mt-6 grid gap-3 sm:hidden">
        {loading && !advocates.length ? (
          <li className="card p-6 text-sm text-gray-600">Loading…</li>
        ) : advocates.length ? (
          advocates.map((a) => <MobileCard key={a.id} a={a} />)
        ) : (
          <li className="card p-6 text-center text-sm text-gray-600">
            Nothing to show yet.
          </li>
        )}
      </ul>
    );
  }
  
