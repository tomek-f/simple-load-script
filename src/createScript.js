import isType from './isType';

const createScript = (scriptAttr) => {
  const script = document.createElement('script');

  if (isType(scriptAttr, Object)) {
    for (const [key, value] of Object.entries(scriptAttr)) {
      script.setAttribute(key, value);
    }
  }

  return script;
};

export default createScript;
