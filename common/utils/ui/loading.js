import ora from 'ora';
import chalk from 'chalk';

const prefix = chalk.bold.blueBright('x');

/**
 * 创建 loading spinner
 * @param {string} message - 加载提示信息
 * @param {object} options - 配置项
 * @param {number} options.delay - 延迟显示时间(ms)，默认 300
 * @returns {object} spinner 控制对象
 */
export const startLoading = (message, { delay = 300 } = {}) => {
    const spinner = ora({
        text: message,
        prefixText: prefix,
        spinner: 'dots',
        color: 'cyan'
    });

    const timer = setTimeout(() => {
        spinner.start();
    }, delay);

    const loading = {
        stop: () => {
            clearTimeout(timer);
            spinner.stop();
            return loading;
        },
        text: (newText) => {
            spinner.text = newText;
            return loading;
        },
        succeed: (msg) => {
            clearTimeout(timer);
            spinner.succeed(msg);
            return loading;
        },
        fail: (msg) => {
            clearTimeout(timer);
            spinner.fail(msg);
            return loading;
        },
        warn: (msg) => {
            clearTimeout(timer);
            spinner.warn(msg);
            return loading;
        },
        info: (msg) => {
            clearTimeout(timer);
            spinner.info(msg);
            return loading;
        }
    };

    return loading;
};
