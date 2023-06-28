import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "@/index.css";
import App from "@/App";
import store from "@/stores/store";
import { AppProvider } from "@/contexts/app";
import { AuthProvider } from "@/contexts/auth";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <AppProvider>
        <AuthProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </AuthProvider>
    </AppProvider>
);
