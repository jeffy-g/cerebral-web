{
    let runApplication: TBC<() => void> =  async () => {
        console.log("---------- Fire main entry point");
        runApplication = null;
        if (/https?:/.test(location.protocol) && navigator.serviceWorker) {
            navigator.serviceWorker.register("./sw.js");
            console.log("service worker registered");
        }
        const atomic = await import("./init-atomic");
        await atomic.initAtomic();
        const renderer = await import("./render");
        renderer.renderUI();
    };
    if (document.readyState !== "complete") {
        window.addEventListener("load", runApplication, { once: true });
        console.log("scheduled window.load");
    } else {
        console.log("document.readyState were already <%s>", document.readyState);
        runApplication();
    }
}