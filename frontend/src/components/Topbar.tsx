type Props = {
  title: string;
  statusText: string;
};

export function TopBar({ title, statusText }: Props) {
  return (
    <header
      style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: "1px solid #e5e5e5",
        background: "blue",
      }}
    >
      <div style={{ fontWeight: 800 }}>{title}</div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>{statusText}</div>
    </header>
  );
}