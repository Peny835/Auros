function msToTime(duration) {
    let milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor(duration / (1000 * 60 * 60)); 

    seconds = (seconds < 10) ? "0" + seconds : seconds;

    let timeString = seconds + "s";

    if (minutes > 0) {
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        timeString = minutes + "m " + timeString;
    }

    if (hours > 0) {
        hours = (hours < 10) ? "0" + hours : hours;
        timeString = hours + "h " + timeString;
    }

    return timeString.trim();
}

module.exports = msToTime;