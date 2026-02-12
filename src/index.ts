export interface Config {
    url: string;
    attrs?: Record<string, string>;
    inBody?: boolean;
    insertInto?: string | null;
    removeScript?: boolean;
}

const defaultConfig = {
    attrs: {},
    inBody: false,
    insertInto: null,
    removeScript: false,
    url: '',
} satisfies Config;

export default function simpleLoadScript(
    config: (Config | string)[],
): Promise<(HTMLScriptElement | undefined)[]>;
export default function simpleLoadScript(
    config: Config | string,
): Promise<HTMLScriptElement | undefined>;
export default function simpleLoadScript(
    config: Config | string | (Config | string)[],
): Promise<HTMLScriptElement | undefined | (HTMLScriptElement | undefined)[]> {
    if (Array.isArray(config)) {
        // oxlint-disable-next-line unicorn/no-array-callback-reference
        return Promise.all(config.map(simpleLoadScript));
    }

    return new Promise((resolve, reject) => {
        if (
            !(
                (typeof config === 'object' && config.url) ||
                typeof config === 'string'
            )
        ) {
            console.log({ config });
            reject(new Error('Object with url or url string needed'));
            return;
        }

        const configProcessed: Required<Config> = Object.assign(
            {},
            defaultConfig,
            typeof config === 'string' ? { url: config } : config,
        );
        const { url, attrs, inBody, insertInto, removeScript } =
            configProcessed;
        const script = window.document.createElement('script');
        const where: HTMLElement | null = insertInto
            ? window.document.querySelector(insertInto)
            : inBody
              ? window.document.body
              : window.document.head;

        if (attrs && typeof attrs === 'object') {
            for (const attr of Object.keys(attrs)) {
                script.setAttribute(attr, attrs[attr]);
            }
        }

        if (where == null) {
            reject(new Error('No DOM element to append script'));
            return;
        }

        script.addEventListener('load', () => {
            if (removeScript) {
                where.removeChild(script);
            }
            resolve(removeScript ? undefined : script);
        });
        script.addEventListener('error', (/* err */) => {
            if (removeScript) {
                where.removeChild(script);
            }
            // oxlint-disable-next-line no-warning-comments
            // TODO ? just return err
            // oxlint-disable-next-line no-warning-comments
            // TODO ? re-throw err with changed message
            reject(new Error('Loading script error'));
        });
        script.src = url;
        where.appendChild(script);
    });
}
