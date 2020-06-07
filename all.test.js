const functions = require('./functions.js');
const reddit = require('./reddit.js');

test('Testing functions file...', () => {
    expect(functions.getRandomTeam(0, 1)).not.toBeNull();
    expect(functions.secondsToMinutes(60)).toBe("1:00");
    expect(functions.secondsToMinutes(30)).toBe("0:30");
    expect(functions.secondsToMinutes(90)).toBe("1:30");
    expect(functions.requestImage("cat", 0, 1)).not.toBeNull();
    expect(functions.requestImage("dog", 0, 1)).not.toBeNull();
});

test('Testing reddit file...', () => {
    expect(reddit.send(0, "dankmemes", 1)).not.toBeNull();
});