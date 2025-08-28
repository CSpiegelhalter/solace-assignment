export function Pill({ children, size = "xs" }: { children: React.ReactNode; size?: "xs" | "sm"; }) {
    return <span className={`pill ${size === "xs" ? "pill-xs" : ""}`}>{children}</span>;
}
