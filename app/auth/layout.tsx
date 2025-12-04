export default function AuthLayout({ children }) {
  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root">
        <div className="mc-bg-1" />
        <div className="mc-noise" />

        <main className="mc-content">
          {children}
        </main>
      </body>
    </html>
  );
}
