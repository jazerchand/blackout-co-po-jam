class Human {
    constructor(tempInteractables, tempPrinter) {
        this.interactables = tempInteractables;
        this.passClicks(tempInteractables, tempPrinter);
    }

    passClicks(tempInteractables, tempPrinter) {
        let wordspans = [];
        for (let span of tempInteractables) {
            if (/\w+/g.test(span.innerText)) {
                wordspans.push(span);
            }
        }
        for (let i = 0; i < this.interactables.length; i++) {
            this.interactables[i].addEventListener('click', function (e) {
                tempPrinter.highlightWord(e.target, i, 'h_select');
                console.log("human listener", i);
            });
        }
    }
}