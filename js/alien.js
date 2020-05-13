class Alien {
    constructor(tempInteractables) {
        this.wordspans = tempInteractables;
        this.rows = this.getRows();
        this.heights;
        // console.log(this.rows, this.heights);
    }

    getRows() {
        let rows = {};
        for (let i = 0; i < this.wordspans.length; i++) {
            let top = this.wordspans[i].offsetTop;
            if (rows[top] == undefined) {
                rows[top] = [];
            }
            rows[top].push(this.wordspans[i]);
        }
        this.heights = int(Object.keys(rows));
        return Object.values(rows);
    }

    selectVisually(mode, parentClass, tempPrinter) {
        let parent = select(parentClass);
        let midX = parent.width / 2;
        let offsetX = parent.elt.offsetLeft;
        let centerX = midX + offsetX;
        let rowPoints = [];
        let selection = [];

        // let centerline = createDiv();
        // centerline.class('centerline');
        // centerline.parent(parent);
        
        if (mode == 'Wave') {
            let dir = random([1,-1]);
            let f = random([0.15,0.2,0.25,0.3]);
            let factor = parent.width*f;
            // console.log("Performing Sine Wave", dir, f);
            let a = 0.0;
            let inc = TWO_PI / this.rows.length;
            for (let i = 0; i < this.rows.length; i++) {
                let left = centerX + (sin(a*dir) * factor);
                // let dot = createDiv();
                // dot.parent(parent);
                // dot.class('dot');
                // dot.position(left, this.heights[i]);
                rowPoints.push(left);
                a += inc;
            }
        }

        for (let i = 0; i < rowPoints.length; i+=2) {
            let minD = 500;
            let match = false;
            for (let j = 0; j < this.rows[i].length; j++) {
                let word = this.rows[i][j];
                let startP = word.offsetLeft;
                let midP = word.offsetLeft + (word.offsetWidth / 2);

                let dist = abs(rowPoints[i] - midP);
                if (dist < minD) {
                    minD = dist;
                    if (dist < 100) {
                        match = word;   
                    }
                }
            }
            if (match) {
                selection.push(match);
            }
        }
      
        for(let i = 0; i<this.wordspans.length; i++){
            tempPrinter.toggleWord(this.wordspans[i], 'd_select');
        }
          
        for (let i = 0; i < selection.length; i++) {
            let index = Object.values(this.wordspans).indexOf(selection[i]);
            tempPrinter.toggleWord(this.wordspans[index], 'd_select');
            tempPrinter.highlightWord(this.wordspans[index], index, 'a_select');
        }
        
        // for (let i = 0; i < selection.length; i++) {
        //     let index = Object.values(this.wordspans).indexOf(selection[i]);
        //     tempPrinter.highlightWord(this.wordspans[index], index, 'a_select');
        // }
    }
}