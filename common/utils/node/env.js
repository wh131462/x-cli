/**
 * 获取环境是开发还是生产
 * @returns {string}
 */
export const env = () => (import.meta.url?.endsWith('env.js') ? 'dev' : 'prod');
