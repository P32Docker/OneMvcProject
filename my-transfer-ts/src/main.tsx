import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {AuthProvider} from "./context/AuthContext.tsx";
import {Provider} from "react-redux";
import {setupStore} from "./store";
import {ThemeProvider} from "./admin/context/ThemeContext.tsx";
import {AppWrapper} from "./admin/components/common/PageMeta.tsx";
import App from "./App.tsx";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log(clientId);
const store = setupStore();

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider>
            <AppWrapper>
                <GoogleOAuthProvider clientId={clientId}>
                    <Provider store={store}>
                        <AuthProvider>
                            <QueryClientProvider client={queryClient}>
                                <App/>
                            </QueryClientProvider>
                        </AuthProvider>
                    </Provider>
                </GoogleOAuthProvider>
            </AppWrapper>
        </ThemeProvider>
    </React.StrictMode>
);