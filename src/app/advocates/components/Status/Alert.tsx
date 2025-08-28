export function Info({ children }: { children: React.ReactNode }) {
    return <div className="alert alert-info">{children}</div>;
}
export function Error({ children }: { children: React.ReactNode }) {
    return <div className="alert alert-error">{children}</div>;
}
