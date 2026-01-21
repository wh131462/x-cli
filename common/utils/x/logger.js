import chalk from 'chalk';

const ICONS = {
    info: '●',
    warn: '▲',
    error: '✖',
    success: '✔',
    debug: '◆'
};

const COLORS = {
    info: { icon: 'cyan', text: 'white' },
    warn: { icon: 'yellow', text: 'yellow' },
    error: { icon: 'red', text: 'red' },
    success: { icon: 'green', text: 'green' },
    debug: { icon: 'magenta', text: 'magenta' }
};

class LOGGER {
    isOn = true;

    _prefix = chalk.bold.blueBright('x');

    _format(type, messages) {
        const icon = chalk[COLORS[type].icon](ICONS[type]);
        return [this._prefix, icon, ...messages];
    }

    on() {
        this.isOn = true;
    }

    off() {
        this.isOn = false;
    }

    get forbidden() {
        return !this.isOn;
    }

    info(...messages) {
        if (this.forbidden) return;
        console.log(...this._format('info', messages));
    }

    warn(...messages) {
        if (this.forbidden) return;
        console.log(...this._format('warn', messages));
    }

    error(...messages) {
        if (this.forbidden) return;
        console.log(...this._format('error', messages));
    }

    success(...messages) {
        if (this.forbidden) return;
        console.log(...this._format('success', messages));
    }

    debug(...messages) {
        if (this.forbidden) return;
        console.log(...this._format('debug', messages));
    }

    /** 无前缀的纯文本输出 */
    log(...messages) {
        if (this.forbidden) return;
        console.log(...messages);
    }

    /** 空行 */
    newline() {
        if (this.forbidden) return;
        console.log();
    }
}

export const logger = new LOGGER();
