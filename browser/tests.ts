declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadScript: (...args: any[]) => Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gmapiready: (...args: any[]) => void;
  }
}

export {};

(async () => {
  try {
    await window.loadScript('./sss');
  } catch (err) {
    const error = err as Error;

    console.log(err, error.message);
    console.assert(
      error.message === 'Error: loading script',
      'err !== `Error: loading script`',
    );
  }

  window
    .loadScript('//code.jquery.com/jquery-2.2.3.js')
    .then(function (scriptRef) {
      console.log('success', scriptRef); // 'success', script ref.
    })
    .catch(function (err) {
      console.log(err);
    });

  window
    .loadScript({
      url: '//code.jquery.com/jquery-2.2.3.js',
      attrs: { id: 'one', charset: 'UTF-8' },
    })
    .then(function (scriptRef) {
      console.log('success', scriptRef); // 'success', script ref.
    })
    .catch(function (err) {
      console.log(err);
    });

  console.log(window);

  window.gmapiready = (...args) => {
    console.log(111, args);
  };

  window
    .loadScript({
      url: '//maps.googleapis.com/maps/api/js?&callback=gmapiready',
      callBackName1: 'gmapiready',
    })
    .then(function (scriptRef) {
      console.log('success', scriptRef); // 'success', undefined
    })
    .catch(function (err) {
      console.log(err);
    });

  return;

  window
    .loadScript('//api.ipinfodb.com/v3/ip-city/?format=json&callback=elo', {
      callBackName: 'elo',
      removeScript: true,
    })
    .then(function (scriptRef) {
      console.log('success', scriptRef); // 'success', res
    })
    .catch(function (err) {
      console.log(err);
    });

  window
    .loadScript(
      '//example.com/test1.js',
      '//example.com/test2.js',
      '//example.com/test3.js',
    )
    .then(function (scriptRef) {
      console.log('success', scriptRef); // 'success', res
    })
    .catch(function (err) {
      console.log(err);
    });

  window
    .loadScript(
      {
        url: '//maps.googleapis.com/maps/api/js?&callback=gmapiready',
        callBackName: 'gmapiready',
      },
      {
        url: '//api.ipinfodb.com/v3/ip-city/?format=json&callback=elo',
        callBackName: 'elo',
        removeScript: true,
      },
      [
        'https://api.twitter.com/1/statuses/oembed.json?id=507185938620219395&callback=elo2',
        { callBackName: 'elo2' },
      ],
      '//code.jquery.com/jquery-2.2.3.js',
    )
    .then(function (scriptRef) {
      console.log('success', scriptRef); // 'success', array
    })
    .catch(function (err) {
      console.log(err);
    });
})();