export const uiStorybookMain = `import type {StorybookConfig} from '@storybook/angular';
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-actions",
    "@storybook/addon-controls",
  ],
  // typescript: {
  //   // Overrides the default Typescript configuration to allow multi-package components to be documented via Autodocs.
  //   skipBabel: true,
  //   check: false,
  // },
  docs: {
    autodocs: true,
    defaultName: '说明',
  },
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  core: {
    // @ts-ignore
    builder: 'webpack5',
  },
};

export default config;
`;
