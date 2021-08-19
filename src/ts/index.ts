import "reflect-metadata";
import { App } from "./app";
import { ProperApp } from "./app.proper";
import { myContainer } from "./inversify.config";

let app: any;
if (window.location.href.endsWith('index.proper.html')) {
    app = myContainer.get<ProperApp>(ProperApp);
} else {
    app = new App();
}
app.init();

declare global {
    interface Window {
        app: App
        goToProperUi: () => void
    }
}
window.app = app;
window.goToProperUi = function() {
    window.location.href = './index.proper.html'
}
