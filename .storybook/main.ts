import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';
import { ProvidePlugin } from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: false // Отключите SWC
      }
    }
  },
  docs: {
    autodocs: 'tag'
  },
  webpackFinal: async (config) => {
    // Добавляем ProvidePlugin для React
    if (!config.plugins) {
      config.plugins = [];
    }
    
    config.plugins.push(
      new ProvidePlugin({
        React: 'react'
      })
    );
    
    // Добавляем правило для обработки изображений
    if (config.module?.rules) {
      // Удаляем существующее правило для изображений, если оно есть
      config.module.rules = config.module.rules.map((rule) => {
        if (rule && typeof rule === 'object' && rule.test instanceof RegExp) {
          if (rule.test.test('.svg')) {
            return { ...rule, exclude: /\.(svg|png|jpg|jpeg|gif)$/i };
          }
        }
        return rule;
      });

      // Добавляем новое правило для изображений
      config.module.rules.push({
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name].[hash:8].[ext]'
        }
      });
    }
    
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@pages': path.resolve(__dirname, '../src/pages'),
        '@components': path.resolve(__dirname, '../src/components'),
        '@ui': path.resolve(__dirname, '../src/components/ui'),
        '@ui-pages': path.resolve(__dirname, '../src/components/ui/pages'),
        '@utils-types': path.resolve(__dirname, '../src/utils/types'),
        '@api': path.resolve(__dirname, '../src/utils/burger-api.ts'),
        '@slices': path.resolve(__dirname, '../src/services/slices'),
        '@selectors': path.resolve(__dirname, '../src/services/selectors')
      };
    }
    
    return config;
  }
};
export default config;
