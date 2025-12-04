export default {
  multipass: false,
  js2svg: {
    finalNewline: true,
  },
  plugins: [
    'preset-default',
    {
      name: 'removeAttrs',
      params: {
        attrs: ['data-name'],
      },
    },
  ],
}
