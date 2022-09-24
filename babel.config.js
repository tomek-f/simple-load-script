module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  const presets = [
    [
      '@babel/preset-env',
      {
        modules: 'auto',
        targets: {
          node: '6.5', // noe 6.5 is 100% ES6
        },
      },
    ],
  ];

  // if (api.env('test')) { … }

  return {
    presets,
  };
};
