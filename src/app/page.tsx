"use client";

import { useEffect, useState, useMemo } from "react";

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

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/advocates", { signal: ac.signal });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data : [];
        setAdvocates(data);
      } catch (e: any) {
        if (e?.name !== "AbortError") setError("Failed to load advocates.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const filteredAdvocates = useMemo(() => {

    const formattedTerm = searchTerm?.trim()?.toLowerCase()

    if (!formattedTerm) return advocates

    const has = (term: unknown) => {
      return String(
        Array.isArray(term) ? term.join(' ') : term ?? ''
      ).toLowerCase().includes(formattedTerm)
    }

    return advocates.filter((e) =>
      has(e.firstName) ||
      has(e.lastName) ||
      has(e.city) ||
      has(e.degree) ||
      has(e.specialties) ||
      has(e.yearsOfExperience) ||
      has(e.phoneNumber)
    )

  }, [advocates, searchTerm])

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
          {filteredAdvocates.map((advocate) => {
            return (

              <tr>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div>{s}</div>
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
