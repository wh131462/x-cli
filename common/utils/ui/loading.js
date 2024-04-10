import ora from 'ora';

/**
 * 开始loading
 * @param message
 * @returns {{fail: fail, warn: warn, stop: stop, succeed: succeed, text: (function(*): *), info: info}}
 */
export const startLoading = (message) => {
    const spinner = ora(message).start();
    return {
        stop: () => {
            spinner.stop();
        },
        text: (newText) => {
            spinner.text = newText;
            return this;
        },
        succeed: (message) => {
            spinner.succeed(` ${message}`);
        },
        fail: (message) => {
            spinner.fail(` ${message}`);
        },
        warn: (message) => {
            spinner.warn(` ${message}`);
        },
        info: (message) => {
            spinner.info(` ${message}`);
        }
    };
};
