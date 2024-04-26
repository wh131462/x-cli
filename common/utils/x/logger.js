import chalk from 'chalk';
import { env } from '#common/utils/node/env.js';

class LOGGER {
    _logo = (type) => chalk.bgBlueBright(chalk.whiteBright(` x-cli => ${type} `));
    isOn = true;

    constructor(_env) {}

    /**
     * 开启
     */
    on() {
        this.isOn = true;
    }

    /**
     * 关闭
     */
    off() {
        this.isOn = false;
    }

    get forbidden() {
        return !this.isOn;
    }

    /**
     * 普通消息
     * @param message{*}
     * @param args{*[]}
     */
    info(message, ...args) {
        if (this.forbidden) return;
        console.log(this._logo('info'), chalk.whiteBright(message, ...args));
    }

    /**
     * 警告
     * @param message{*}
     * @param args{*[]}
     */
    warn(message, ...args) {
        if (this.forbidden) return;
        console.log(this._logo('warn'), chalk.bgYellowBright(message, ...args));
    }

    /**
     * 错误信息
     * @param message{*}
     * @param args{*[]}
     */
    error(message, ...args) {
        if (this.forbidden) return;
        console.log(this._logo('error'), chalk.bgRedBright(message, ...args));
    }
}

export const logger = new LOGGER(env());
