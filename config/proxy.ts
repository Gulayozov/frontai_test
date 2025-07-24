export default {
  dev: {
    '/api/': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/api/': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};