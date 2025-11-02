import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import storybook from 'eslint-plugin-storybook';

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'storybook-static/**'],
  },
  ...nextCoreWebVitals,
  ...storybook.configs['flat/recommended'],
];

export default config;
