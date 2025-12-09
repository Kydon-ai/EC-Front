// 导入ESLint的JavaScript规则集
import js from '@eslint/js'
// 导入全局变量定义集合，用于声明不同环境中的全局变量
import globals from 'globals'
// 导入React Hooks相关的ESLint插件，用于检查React Hooks的正确使用
import reactHooks from 'eslint-plugin-react-hooks'
// 导入React Refresh相关的ESLint插件，用于检查是否兼容Fast Refresh功能
import reactRefresh from 'eslint-plugin-react-refresh'
// 导入TypeScript-ESLint插件，用于处理TypeScript文件的linting
import tseslint from 'typescript-eslint'

// 使用TypeScript-ESLint的config函数创建并导出配置
// 这种方式是ESLint v9推荐的扁平配置格式（Flat Config）
export default tseslint.config(
  // 忽略配置块：指定不需要进行lint检查的文件或目录
  // 'dist'目录通常包含编译后的代码，这些是构建过程的输出结果
  // 忽略这些文件可以提高linting效率，并避免对自动生成代码产生误报
  { ignores: ['dist', 'node_modules'] },
  // TypeScript文件配置块：定义应用于TypeScript和TSX文件的规则
  {
    // extends配置：继承推荐的规则集
    // 包括ESLint推荐的JavaScript规则和TypeScript-ESLint推荐的TypeScript规则
    extends: [js.configs.recommended, ...tseslint.configs.recommended],

    // files配置：指定此配置块应用于哪些文件
    // **/*.{ts,tsx} 表示匹配所有目录下的.ts和.tsx文件
    files: ['**/*.{ts,tsx}'],

    // languageOptions：语言相关配置
    languageOptions: {
      // 指定ECMAScript版本为2020，确保ESLint能够识别该版本的语法特性
      ecmaVersion: 2020,
      // 声明全局变量环境为浏览器环境，避免对window、document等浏览器全局变量报错
      globals: globals.browser,
    },

    // plugins配置：启用需要的ESLint插件
    plugins: {
      // 启用React Hooks插件，用于检查Hooks的正确使用
      'react-hooks': reactHooks,
      // 启用React Refresh插件，用于确保组件兼容React的Fast Refresh功能
      'react-refresh': reactRefresh,
    },

    // rules配置：具体的规则设置
    rules: {
      // 应用React Hooks插件的推荐规则
      // 包括exhaustive-deps（检查useEffect依赖数组）和rules-of-hooks（检查Hooks使用规则）
      ...reactHooks.configs.recommended.rules,

      // 配置React Refresh规则
      // 'warn'级别表示违反规则时显示警告而不是错误
      // allowConstantExport: true 允许导出常量，这对于组件中导出类型或工具函数很有用
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'indent': ['error', 'tab', {
        "SwitchCase": 1, // case 子句相对于 switch 语句缩进 1 个 tab
        "VariableDeclarator": 1, // 变量声明语句的缩进级别
      }],
      // 禁用未定义变量、any类型的校验、空数组副作用依赖、多常量导出
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      "react-hooks/exhaustive-deps": 'off',
      "react-refresh/only-export-components": 'off'
    },
  },
)

