import simpleLoadScript from '../src/index.js';

declare global {
    interface Window {
        simpleLoadScript: typeof simpleLoadScript;
    }
}

window.simpleLoadScript = simpleLoadScript;
