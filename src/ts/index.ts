import { App } from "./app";

declare global {
    interface Window { App: App; }
}

const app = new App();
app.init();

window.App = app;