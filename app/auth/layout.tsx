export default function AuthLayout({ children }) {
  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root">
        {children}
      </body>
    </html>
  );
}
