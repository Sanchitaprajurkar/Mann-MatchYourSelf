import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import { CheckoutProvider } from "./context/CheckoutContext";
import ScrollToTop from "./components/ScrollToTop";
import App from "./App.tsx";
import { logConsoleBranding } from "./utils/consoleBranding";
import "./index.css";
import "./styles/theme.css";
import "./App.css";

logConsoleBranding();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
          <UIProvider>
            <AuthProvider>
              <CheckoutProvider>
                <CartProvider>
                  <WishlistProvider>
                    <App />
                  </WishlistProvider>
                </CartProvider>
              </CheckoutProvider>
            </AuthProvider>
          </UIProvider>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
