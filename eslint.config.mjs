import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vuePlugin from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import importPlugin from "eslint-plugin-import";

// 公共浏览器环境全局变量
const browserGlobals = {
  document: "readonly",
  window: "readonly",
  navigator: "readonly",
  console: "readonly",
  setTimeout: "readonly",
  HTMLElement: "readonly",
  HTMLAnchorElement: "readonly",
  Element: "readonly",
  URL: "readonly",
  fetch: "readonly",
  Headers: "readonly",
  Request: "readonly",
  Response: "readonly",
  MouseEvent: "readonly",
  Event: "readonly",
  CustomEvent: "readonly",
  ResizeObserver: "readonly",
  crypto: "readonly"
};

// 公共导入顺序配置
const importOrderConfig = {
  groups: [
    "builtin",
    "external",
    "internal",
    "parent",
    "sibling",
    "index",
    "type"
  ],
  pathGroups: [
    {
      pattern: "vue",
      group: "external",
      position: "before"
    },
    {
      pattern: "vue-*",
      group: "external",
      position: "before"
    },
    {
      pattern: "@vue/**",
      group: "external",
      position: "before"
    },
    {
      pattern: "@/**",
      group: "internal",
      position: "before"
    }
  ],
  pathGroupsExcludedImportTypes: ["type"],
  "newlines-between": "always",
  alphabetize: {
    order: "asc",
    caseInsensitive: true
  }
};

// 公共 TypeScript 规则
const commonTypeScriptRules = {
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_"
    }
  ],
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/no-inferrable-types": "error",
  "@typescript-eslint/prefer-as-const": "error",
  "@typescript-eslint/no-non-null-assertion": "warn"
};

// 公共 JavaScript 规则
const commonJavaScriptRules = {
  "no-debugger": "error",
  "no-unused-vars": "off",
  "prefer-const": "error",
  "no-var": "error",
  "object-shorthand": "error",
  "prefer-arrow-callback": "error",
  "prefer-template": "error",
  "prefer-rest-params": "error",
  "no-useless-escape": "error",
  "no-irregular-whitespace": "error",
  "no-prototype-builtins": "error",
  "no-fallthrough": "error"
};

// 公共代码风格规则
const commonStyleRules = {
  quotes: ["error", "double"],
  semi: ["error", "always"],
  "comma-dangle": ["error", "never"],
  "eol-last": "error",
  "no-trailing-spaces": "error",
  indent: ["error", 2],
  "comma-spacing": "error",
  "key-spacing": "error",
  "keyword-spacing": "error",
  "space-before-blocks": "error",
  "space-before-function-paren": [
    "error",
    {
      anonymous: "always",
      named: "never",
      asyncArrow: "always"
    }
  ],
  "space-in-parens": "error",
  "space-infix-ops": "error",
  "space-unary-ops": "error",
  "spaced-comment": "error",
  "arrow-spacing": "error",
  "brace-style": ["error", "1tbs", { allowSingleLine: true }]
};

export default [
  js.configs.recommended,
  ...vuePlugin.configs["flat/recommended"],

  // JavaScript/TypeScript 文件配置
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: browserGlobals
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.app.json"
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"]
        }
      }
    },
    rules: {
      "import/order": ["error", importOrderConfig],
      "import/no-duplicates": "error",
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      ...commonTypeScriptRules,
      ...commonJavaScriptRules,
      ...commonStyleRules
    }
  },

  // Vue 文件配置
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"]
      },
      globals: browserGlobals
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      vue: vuePlugin,
      import: importPlugin
    },
    rules: {
      // Vue 3 专用规则
      "vue/no-ref-as-operand": "error",
      "vue/no-watch-after-await": "error",
      "vue/no-useless-v-bind": "error",
      "vue/no-unused-refs": "error",

      // Vue 通用规则
      "vue/no-vhtml": "off",
      "vue/multi-word-component-names": "off",
      "vue/no-unused-vars": "error",
      "vue/attribute-hyphenation": ["error", "always"],
      "vue/component-definition-name-casing": ["error", "PascalCase"],
      "vue/html-indent": "off",
      "vue/html-quotes": ["error", "double"],
      "vue/max-attributes-per-line": "off",
      "vue/mustache-interpolation-spacing": ["error", "always"],
      "vue/v-bind-style": ["error", "shorthand"],
      "vue/v-on-style": ["error", "shorthand"],
      "vue/v-slot-style": ["error", "shorthand"],
      "vue/require-default-prop": "off",
      "vue/require-prop-types": "off",
      "vue/prop-name-casing": ["error", "camelCase"],
      "vue/singleline-html-element-content-newline": "off",
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always",
            normal: "never",
            component: "always"
          },
          svg: "always",
          math: "always"
        }
      ],
      "vue/html-closing-bracket-newline": [
        "error",
        {
          singleline: "never",
          multiline: "never"
        }
      ],

      // 导入规则（Vue 文件简化版）
      "import/order": ["error", importOrderConfig],
      "import/no-duplicates": "error",
      "import/no-unresolved": "off",
      "import/named": "off",
      "import/default": "off",
      "import/namespace": "off",

      ...commonTypeScriptRules,
      ...commonJavaScriptRules,
      ...commonStyleRules
    }
  },

  // TypeScript 专用严格配置
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.app.json", "./tsconfig.node.json"]
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ]
    }
  },

  // 忽略文件配置
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "*.config.js",
      "*.config.ts",
      "coverage/**",
      ".vscode/**",
      ".git/**"
    ]
  }
];
