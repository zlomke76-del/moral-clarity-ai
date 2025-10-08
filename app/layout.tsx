// app/layout.tsx
export const metadata = {
  title: "Moral Clarity AI",
  description: "Bridge + app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          background: "#0b0b0c",
          color: "#f7f7f7",
        }}
      >
        {children}
      </body>
    </html>
  );
}
