function upTo(max, val) {
    if (val > max) {
        return max;
    }

    return val;
}

function downTo(min, val) {
    if (val < min) {
        return min;
    }

    return val;
}

class Game {
    constructor() {
        this.winner = null;
        this.entry = null;
        this.percent = 0;
        this.input = "";
        this.a = new Player("Blue", "💙", "bg-blue-900");
        this.b = new Player("Red", "❤️", "bg-red-900");
        this.writer = this.a;
    }

    next() {
        if (this.a.isDead() || this.b.isDead()) {
            return this.end();
        }

        if (this.writer == this.a) {
            this.writer = this.b;
        } else if (this.writer == this.b) {
            this.writer = this.a;
        } else {
            throw new Error("Writer is neither a, nor b.");
        }

        this.input = "";
        this.entry = this.words.entry();
        this.timer.start();
    }

    enter() {
        if (!this.words.ok(this.input, this.entry)) {
            this.timer.duration -= 1500;
            return;
        }

        this.correct();
    }

    correct() {
        this.next();
    }

    timeout() {
        this.writer.takeLife();
        this.next();
    }

    begin() {
        this.words = new Words();
        this.timer = new Timer(() => this.timeout(), () => this.progress());
        this.entry = this.words.entry();
        this.timer.start();
    }

    end() {
        this.timer.stop();

        if (this.a.isDead()) {
            this.winner = this.b;
        }

        if (this.b.isDead()) {
            this.winner = this.a;
        }
    }

    progress() {
        this.percent = this.timer.percent();
    }
}

class Timer {
    constructor(onTimeout, onProgress) {
        this.starts = 0;
        this.onTimeout = onTimeout;
        this.onProgress = onProgress;
        this.startedAt = null;
        this.duration = null;
        this.stopped = false;
    }

    stop() {
        this.stopped = true;
    }

    start() {
        this.startedAt = Date.now();
        this.duration = this.nextDuration();
        this.starts++;

        const frame = () => {
            if (this.stopped) {
                return;
            }

            if (this.isTimeout()) {
                this.onTimeout();
                return;
            }

            this.onProgress();
            requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }

    timeout() {
        this.onTimeout();
    }

    nextDuration() {
        return downTo(4000, 15000 - this.starts * 300);
    }

    isTimeout() {
        return this.startedAt + this.duration < Date.now();
    }

    passed() {
        return upTo(this.duration, Date.now() - this.startedAt);
    }

    percent() {
        return upTo(100, (1 - (this.passed() / this.duration)) * 100);
    }
}

class Words {
    constructor() {
        this.list = dictionary.words;
        this.set = new Set(this.list);
        this.used = new Set();
    }

    ok(input, entry) {
        input = this.clear(input);
        entry = this.clear(entry);
        const ok = !this.was(input) && this.has(input) && input.includes(entry);

        if (ok) {
            this.used.add(input);
        }

        return ok;
    }

    has(word) {
        word = this.clear(word);
        return this.set.has(word);
    }

    was(word) {
        return this.used.has(word);
    }

    entry() {
        const entries = [
            "ко", "рак", "тель", "ни", "ша", "ло", "ма", "бе", "ку", "ви",
            "про", "са", "ди", "ра", "ле", "то", "фи", "ча", "ду", "жа",
            "на", "пи", "со", "ре", "му", "ка", "га", "ли", "не", "те",
            "ша", "хо", "би", "ко", "зи", "ва", "ро", "ну", "ка", "ди",
            "фа", "ле", "мо", "це", "ру", "ги", "ча", "шо", "ту", "ви"
        ];
        const i = Math.floor(Math.random() * entries.length);
        return entries[i];
    }

    clear(word) {
        return word.replace(/[^а-яА-ЯёЁ-]/g, "").toLowerCase().replace("ё", "е");
    }
}

class Player {
    constructor(name, heart, tailwindcss, lives = 3) {
        this.name = name;
        this.heart = heart;
        this.tailwindcss = tailwindcss;
        this.lives = lives;
    }

    isDead() { return this.lives <= 0; }
    takeLife() {
        if (this.isDead()) {
            return;
        }

        this.lives--;
    }
}
