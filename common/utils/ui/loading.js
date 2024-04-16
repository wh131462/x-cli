import ora from 'ora';

/**
 * 开始loading
 * @param message
 * @returns {{fail: fail, warn: warn, stop: stop, succeed: succeed, text: (function(*): *), info: info}}
 */
export const startLoading = (message) => {
    const spinner = ora(message);
    const timer = setTimeout(() => {
        spinner.start();
    }, 1500);
    return {
        stop: () => {
            clearTimeout(timer);
            spinner.stop();
        },
        text: (newText) => {
            spinner.text = newText;
            return this;
        },
        succeed: (message) => {
            clearTimeout(timer);
            spinner.succeed(` ${message}`);
        },
        fail: (message) => {
            clearTimeout(timer);
            spinner.fail(` ${message}`);
        },
        warn: (message) => {
            clearTimeout(timer);
            spinner.warn(` ${message}`);
        },
        info: (message) => {
            clearTimeout(timer);
            spinner.info(` ${message}`);
        }
    };
};
