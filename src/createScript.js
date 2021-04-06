const createScript = opts => {
  const script = document.createElement('script');

  if (opts.attrs && typeObj(opts.attrs)) {
    for (const attr of Object.keys(opts.attrs)) { // todo entries?
      script.setAttribute(attr, opts.attrs[attr]);
    }
  }

  return script;
};

export default createScript;
