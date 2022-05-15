const EventEmitter = require("events");
const moment = require('moment');
const colors = require("colors/safe");

const INTERVAL = 1000;
const eventEmitter = new EventEmitter();

class Timer {
    constructor(date) {
        this.name = date.trim()
        this.endTimeMs = this._getTimeMs(date)
        this.listener = this._renderTimer.bind(this)
        eventEmitter.on('timer:render', this.listener)
    }

    _getTimeMs(dateString) {
        const { 0: time, 1: date } = dateString.split(' ');
        const { 0: day, 1: month, 2: year } = date.split('.')
        return +moment(`${year}-${month}-${day} ${time}`).format("x")
    }

    _renderTimer() {
        const diff = moment(this.endTimeMs).diff(moment())
        if (diff > 0) {
            const days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0;
            const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0;
            const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0;
            const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;
            const nameDays = this._declensionNum(days, ['день', 'дня', 'дней']);
            const nameHours = this._declensionNum(hours, ['час', 'часа', 'часов']);
            const nameMinutes = this._declensionNum(minutes, ['минута', 'минуты', 'минут']);
            const nameSeconds = this._declensionNum(seconds, ['секунда', 'секунды', 'секунд']);
            console.log(colors.green(` Таймер  <<${this.name}>> остановиться через : ${days} ${nameDays} ${hours} ${nameHours} ${minutes} ${nameMinutes} ${seconds} ${nameSeconds}`))
            return;
        } else {
            eventEmitter.removeListener('timer:render', this.listener);
            eventEmitter.on('timer:stoped', () => { console.log(colors.grey(` Таймер  <<${this.name}>> завершен`))})
        }
        console.log(colors.grey(` Таймер  <<${this.name}>> завершен`) )
    }

    _declensionNum(num, words) {
        return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
    }
}

const run = () => {
    const timers = process.argv.slice(2).map(time => new Timer(time));
    console.log(colors.yellow('Запуск таймеров'));
    process.stdout.cursorTo(0)
    process.stdout.moveCursor(0, timers.length);
    setInterval(() => {
        if (eventEmitter.listenerCount('timer:render') > 0) {
            process.stdout.cursorTo(0)
            process.stdout.moveCursor(0, -(timers.length));
            process.stdout.clearScreenDown()
            eventEmitter.emit('timer:stoped')
            eventEmitter.emit('timer:render')
        } else {
            console.log(colors.yellow('Таймеры завершились'));
            process.exit(1)
        }
    }, INTERVAL)
}

run()
// Format timer like ("time date": "12:00 15.05.2022")
