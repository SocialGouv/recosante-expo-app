export default ({ config }) => {
  return {
    ...config,
    name: 'Recosante',
    slug: 'recosante',
    updates: {
      url: 'https://u.expo.dev/8d8b446e-c8db-4641-b730-5cef195e96da',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  };
};
