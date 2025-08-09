import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // 전역으로 무시할 파일 설정
  {
    ignores: ['dist/**'],
  },

  // 기본 설정 (JS, TypeScript)
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 일부 규칙 완화
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'warn',
    },
  },

  // React 관련 설정
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // 플러그인의 추천 규칙 적용
      ...pluginReactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
    },
  },

  // Prettier 설정 (반드시 배열의 마지막에 위치해야 합니다)
  eslintConfigPrettier,
];
