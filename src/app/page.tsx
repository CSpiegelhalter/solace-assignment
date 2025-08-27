"use client";

import { useEffect, useState } from "react";
import { AdvocatesResponse } from "./api/advocates/route";

type Advocate = {
  id: string | number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number | string;
  phoneNumber: string;
};

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const [debouncedTerm, setDebouncedTerm] = useState("")

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 300);
    return () => clearTimeout(id);
  }, [searchTerm])

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams()

        if (debouncedTerm) params.set('term', debouncedTerm)
        params.set('page', String(page))
        params.set('pageSize', String(pageSize))

        const res = await fetch(`/api/advocates?${params.toString()}`, { signal: ac.signal });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data: AdvocatesResponse = await res.json();
        console.log(data)

        setAdvocates(data.items);
      } catch (e: any) {
        if (e?.name !== "AbortError") setError("Failed to load advocates.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [page, pageSize, debouncedTerm]);


  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input style={{ border: "1px solid black" }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button onClick={() => setSearchTerm('')}>Reset Search</button>
      </div>

      {loading && <p style={{ marginTop: 16 }}>Loading…</p>}
      {error && <p style={{ color: "red", marginTop: 16 }}>{error}</p>}


      <table style={{ marginTop: 24, width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {advocates.map((advocate) => {
            return (
              <tr key={advocate.id}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div key={s}>{s}</div>
                  ))}

                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>

            );
          })}
        </tbody>
      </table>
    </main>
  );
}
