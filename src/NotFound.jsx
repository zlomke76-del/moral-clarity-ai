import NotFound from "./NotFound.jsx";

<Routes>
  <Route path="/" element={<App />} />
  <Route path="/privacy" element={<Privacy />} />
  <Route path="/terms" element={<Terms />} />
  <Route path="*" element={<NotFound />} />   {/* fallback */}
</Routes>
