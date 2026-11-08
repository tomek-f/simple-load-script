interface Config {
    url: string;
    attrs?: Record<string, string>;
    inBody?: boolean;
    insertInto?: string | null;
    removeScript?: boolean;
    signal?: AbortSignal;
}

function getTarget(
    insertInto: string | null,
    inBody: boolean,
): HTMLElement | null {
    if (insertInto) {
        return window.document.querySelector<HTMLElement>(insertInto);
    }
    return inBody ? window.document.body : window.document.head;
}

function loadScript(
    config: Config | string,
): Promise<HTMLScriptElement | undefined> {
    return new Promise((resolve, reject) => {
        const options: Config | null | undefined =
            typeof config === 'string' ? { url: config } : config;

        if (options == null || typeof options !== 'object' || !options.url) {
            reject(new Error('Object with url or url string needed'));
            return;
        }

        const {
            url,
            attrs,
            inBody = false,
            insertInto = null,
            removeScript = false,
            signal,
        } = options;

        if (signal?.aborted) {
            reject(signal.reason);
            return;
        }

        const where = getTarget(insertInto, inBody);

        if (where == null) {
            reject(new Error('No DOM element to append script'));
            return;
        }

        const script = window.document.createElement('script');

        if (attrs != null && typeof attrs === 'object') {
            for (const [name, value] of Object.entries(attrs)) {
                script.setAttribute(name, value);
            }
        }

        const cleanup = (): void => {
            script.removeEventListener('load', onLoad);
            script.removeEventListener('error', onError);
            signal?.removeEventListener('abort', onAbort);
        };
        const onLoad = (): void => {
            cleanup();
            if (removeScript) {
                script.remove();
            }
            resolve(removeScript ? undefined : script);
        };
        const onError = (event: Event): void => {
            cleanup();
            if (removeScript) {
                script.remove();
            }
            reject(new Error(`Loading script error: ${url}`, { cause: event }));
        };
        const onAbort = (): void => {
            cleanup();
            script.remove();
            reject(signal?.reason);
        };

        script.addEventListener('load', onLoad);
        script.addEventListener('error', onError);
        signal?.addEventListener('abort', onAbort);
        script.src = url;
        where.appendChild(script);
    });
}

function simpleLoadScript(
    config: (Config | string)[],
): Promise<(HTMLScriptElement | undefined)[]>;
function simpleLoadScript(
    config: Config | string,
): Promise<HTMLScriptElement | undefined>;
function simpleLoadScript(
    config: Config | string | (Config | string)[],
): Promise<HTMLScriptElement | undefined | (HTMLScriptElement | undefined)[]> {
    if (Array.isArray(config)) {
        return Promise.all(config.map((item) => loadScript(item)));
    }

    return loadScript(config);
}

export type { Config };

export default simpleLoadScript;
