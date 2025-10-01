import MoralClarityBox from "./components/MoralClarityBox";

export default function Page(){
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-2">Moral Clarity AI — Bridge</h1>
      <p className="mb-6 text-sm opacity-80">If you can see this page, the app built successfully. The API route lives at <code>/api/chat</code>.</p>
      <MoralClarityBox />
    </main>
  );
}