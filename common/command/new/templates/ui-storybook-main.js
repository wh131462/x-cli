export const uiStorybookMain = `import type {StorybookConfig} from '@storybook/angular';
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    "@storybook/addon-essentials"
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
    builder: '@storybook/builder-webpack5',
  },
};

export default config;
`;
