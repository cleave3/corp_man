import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true
        }
    }
});

const localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: localStoragePersister }}>
            <ThemeProvider>
                <AppWrapper>
                    <App />
                </AppWrapper>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </PersistQueryClientProvider>
    </StrictMode>
);
