import chalk from 'chalk';
import { env } from '#common/utils/node/env.js';
import { createEnum } from '#common/utils/node/enum.js';

class LOGGER {
    _TypeBg = createEnum(['info', 'bgBlueBright'], ['warn', 'bgYellow'], ['error', 'bgRedBright']);
    _logo = (type) => chalk.bgBlueBright(chalk[this._TypeBg[type]](` x-cli => ${type} `));
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
     * @param messages
     */
    info(...messages) {
        if (this.forbidden) return;
        console.log(this._logo('info'), ...messages);
    }

    /**
     * 警告
     * @param messages
     */
    warn(...messages) {
        if (this.forbidden) return;
        console.log(this._logo('warn'), ...messages);
    }

    /**
     * 错误信息
     * @param messages
     */
    error(...messages) {
        if (this.forbidden) return;
        console.log(this._logo('error'), ...messages);
    }
}

export const logger = new LOGGER(env());
