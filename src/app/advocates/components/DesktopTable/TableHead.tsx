export function TableHead() {
    return (
        <thead className="thead">
            <tr>
                {["First Name", "Last Name", "City", "Degree", "Specialties", "Years", "Phone"].map((h) => (
                    <th key={h} className="th">{h}</th>
                ))}
            </tr>
        </thead>
    );
}
