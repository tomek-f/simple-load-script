const getGlobalThis = typeof globalThis !== 'undefined' ? globalThis : window;

export default getGlobalThis;
