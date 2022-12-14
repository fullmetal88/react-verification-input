import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import dts from "rollup-plugin-dts"
import del from 'rollup-plugin-delete'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/CodeInput.cjs',
        format: "cjs",
      },
      {
        file: 'dist/CodeInput.esm.js',
        format: "esm",
      }
    ],
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true
      }),
      postcss({
        plugins: []
      })
    ]
  },
  {
    input: "dist/types/index.d.ts",
    output: [
      {
        file: "dist/CodeInput.d.ts",
        format: "esm"
      }
    ],
    plugins: [
      dts(),
      del({
        targets: 'dist/types', hook: 'generateBundle'
      })
    ],
  },
];
