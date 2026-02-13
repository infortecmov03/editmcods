
module.exports = {
  // Define que o ESLint deve parar de procurar por arquivos de configuração em diretórios pai
  root: true,

  // Ambiente onde o código será executado (browser, node, etc.)
  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  // Extensões de configuração que serão aplicadas
  extends: [
    'eslint:recommended', // Regras recomendadas pelo ESLint
    'plugin:react/recommended', // Regras recomendadas para React
    'plugin:react-hooks/recommended', // Regras recomendadas para React Hooks
    'plugin:@typescript-eslint/recommended', // Regras recomendadas para TypeScript
    'plugin:import/errors', // Regras para imports
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended', // Regras de acessibilidade para JSX
    'prettier', // Integração com o Prettier, desativa regras de formatação do ESLint
  ],

  // Parser para que o ESLint entenda TypeScript
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Habilita o parsing de JSX
    },
    ecmaVersion: 'latest', // Usa a versão mais recente do ECMAScript
    sourceType: 'module', // Permite o uso de imports
  },

  // Plugins que adicionam novas regras ou funcionalidades
  plugins: [
    'react',
    '@typescript-eslint',
    'import',
    'jsx-a11y',
    'react-hooks',
  ],

  // Regras específicas do projeto (sobrescrevem as configurações das extensões)
  rules: {
    // Desativa a necessidade de importar o React em escopos de arquivos JSX (padrão no React 17+)
    'react/react-in-jsx-scope': 'off',
    // Permite o uso de `any` em TypeScript (pode ser ajustado para 'error' para maior rigor)
    '@typescript-eslint/no-explicit-any': 'warn',
    // Garante a ordem correta dos imports
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },

  // Configurações adicionais
  settings: {
    react: {
      version: 'detect', // Detecta automaticamente a versão do React instalada
    },
    'import/resolver': {
      typescript: {}, // Ajuda o ESLint a resolver os caminhos de import do TypeScript
    },
  },
};
