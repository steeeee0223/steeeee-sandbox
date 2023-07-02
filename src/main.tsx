import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "@/index.css";
import App from "@/App";
import store, { persistor } from "@/stores/store";
import { AppProvider } from "@/contexts/app";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <AppProvider>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </AppProvider>
);
