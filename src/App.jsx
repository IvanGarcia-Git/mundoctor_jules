
import React from "react";
import AppProviders from "@/AppProviders";
import AppRouter from "@/AppRouter";

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
