const placementNode = opts => {
  if (opts.insertInto) {
    return document.querySelector(opts.insertInto);
  }

  return opts.inBody
    ? document.body
    : document.head;
};

export default placementNode;
