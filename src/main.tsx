import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "@/index.css";
import App from "@/App";
import store from "@/stores/store";
import { AppProvider } from "@/contexts/app";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <AppProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </AppProvider>
);
