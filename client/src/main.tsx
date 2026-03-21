import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import ScrollToTop from "./components/ScrollToTop";
import App from "./App.tsx";
import "./index.css";
import "./styles/theme.css";
import "./App.css";

// Developer credit - production only
if (import.meta.env.PROD) {
  console.log(
    "%cDeveloped by Sanchita Rajurkar | sanchitarajurkar@gmail.com",
    "font-weight: bold;",
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <UIProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </UIProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
