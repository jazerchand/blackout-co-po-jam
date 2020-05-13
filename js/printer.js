class Printer {
    constructor(temp_corpus) {
        this.title = this.custom_split(temp_corpus[0]);
        this.body = temp_corpus.slice(1);
        this.clean_body();
        this.poem_word = {};
        this.word_data = {};
        this.canvasInfo = {};
        this.blackoutBttn;
        // this.preloadVoice = new SpeechSynthesisUtterance('Blackout');
    }

    clean_body() {
        this.body = join(this.body, "~");
        this.body = this.body.replace(/~~?/g, this.replacer_func);
        this.body = this.custom_split(this.body);
    }

    replacer_func(match) {
        if (match.length == 2) {
            return " NLN ";
        }
        else {
            return " ";
        };
    }

    custom_split(temp_string) {
        return temp_string.split(/(\W)/);
    }

    showText(container_name, title_flag, body_flag) {
        let container = select(container_name).elt;
        if (title_flag) {
            let title_container = container.children[0];
            this.createSpans(title_container, this.title);
        };
        if (body_flag) {
            let body_container = container.children[1];
            for (let t in this.body) {
                if (/\bNLN\b/g.test(this.body[t])) {
                    this.body[t] = "</br></br>";
                };
            }
            this.createSpans(body_container, this.body);
        };
        this.canvasInfo.parent = container;
    }

    createSpans(parent, text) {
        this.freshIt(parent);
        for (let t of text) {
            let span = createSpan(t);
            span.parent(parent);
            if (/\s/g.test(t) || !t.length || t == "</br></br>" || rita.isPunctuation(t)) {
                span.class('c_item space');
            }
            else {
                span.class('c_item word');
                span.attribute('data-state', '0');
            };
        }
    }

    freshIt(parent) {
        if (parent.childElementCount) {
            while (parent.hasChildNodes()) {
                parent.removeChild(parent.firstChild);
            }
        }
    }

    highlightWord(word, i, classType) {
        if (word.dataset.state == '0') {
            word.dataset.state = '1';
            word.classList.add(classType);
            this.poem_word[i] = word.innerHTML;
            this.word_data[i] = this.getWordData(word);
        }
        else if (word.dataset.state == '1') {
            word.dataset.state = '0';
            word.classList.remove(classType);
            delete this.poem_word[i];
            delete this.word_data[i];
        };
    }

    toggleWord(word, toggleClass) {
        if (!word.classList.contains(toggleClass)) {
            word.classList.add(toggleClass);
        }
        else {
            word.classList.remove(toggleClass);
        }
    }

    getWordData(word) {
        return word.offsetLeft + '~' + word.offsetTop + '~' + word.offsetWidth + '~' + word.offsetHeight + '~' + window.getComputedStyle(word).fontSize;
    }

    showBlackoutButtons(container_name, mode_name) {
        let parent = select(container_name).elt;
        this.freshIt(parent);
        let blackoutSwitch = createDiv("Done").parent(parent).class('button_blackout button_blackout_off').attribute('data-state', '0').elt;
        let screenshotSwitch = createDiv("🔮 Save").parent(parent).class('button_screenshot').elt;
        let micSwitch = createDiv("🎤").parent(parent).class('button_mic').elt;

        this.blackoutBttn = blackoutSwitch;
        this.activateBlackout(blackoutSwitch, screenshotSwitch, mode_name, micSwitch);
    }

    activateBlackout(blackoutSwitch, screenshotSwitch, mode_name, micSwitch) {
        this.toggleCanvas(false);
        blackoutSwitch.addEventListener('click', function () {
            if (blackoutSwitch.dataset.state == '0') {
                // console.log("showing blaky");
                blackoutSwitch.dataset.state = 1;
                if (blackoutSwitch.classList.contains('button_blackout_off')) {
                    blackoutSwitch.classList.remove('button_blackout_off');
                }
                blackoutSwitch.classList.add('button_blackout_on');
                blackoutSwitch.style.color = 'rgb(209, 14, 95)';
                screenshotSwitch.style.display = 'flex';
                micSwitch.style.display = 'flex';
                this.toggleCanvas(true);
            }
            else {
                // console.log("hiding blaky");
                blackoutSwitch.dataset.state = 0;
                if (blackoutSwitch.classList.contains('button_blackout_on')) {
                    blackoutSwitch.classList.remove('button_blackout_on');
                }
                blackoutSwitch.classList.add('button_blackout_off');
                blackoutSwitch.style.color = 'inherit';
                screenshotSwitch.style.display = 'none';
                micSwitch.style.display = 'none';
                this.toggleCanvas(false);
            }
        }.bind(this));
        this.activateScreenshot(screenshotSwitch, mode_name);
        this.activateMic(micSwitch);
    }

    autoBlackout() {
        this.blackoutBttn.click();
    }

    activateScreenshot(screenshotSwitch, mode_name) {
        screenshotSwitch.addEventListener('click', function () {
            save('Poem_by_' + mode_name + '.jpg');
        });
    }

    activateMic(micSwitch) {

        speechSynthesis.onvoiceschanged = speechSynthesis.getVoices();

        micSwitch.addEventListener('click', function () {
            let poem = rita.untokenize(Object.values(this.poem_word));
            var voices = window.speechSynthesis.getVoices();
            console.log(voices);
            let speaker;
            if (poem.length) {
                speaker = new SpeechSynthesisUtterance(poem);
                speaker.pitch = 2;
                speaker.rate = 0.4;
            }
            else {
                speaker = new SpeechSynthesisUtterance("Please select words to make a poem.");
                speaker.pitch = 2;
                speaker.rate = 0.75;
            }

//             speaker.voice = voices[1];
            speaker.volume = 1;

            window.speechSynthesis.speak(speaker);
            // console.log(window.speechSynthesis);
        }.bind(this));
    }

    getCanvasInfo(container) {
        let title_container = container.children[0];
        let body_container = container.children[1];
        let canvasW = container.offsetWidth - 8;
        let canvasH = int(window.getComputedStyle(body_container).marginBottom) + body_container.offsetTop + body_container.offsetHeight;
        let textH = body_container.offsetHeight + title_container.offsetHeight + int(window.getComputedStyle(body_container).marginTop);
        let textBox = title_container.offsetLeft + '~' + title_container.offsetTop + '~' + body_container.offsetWidth + '~' + textH;
        console.log(canvasW, canvasH, textBox);
        return [canvasW, canvasH, textBox];
    }

    toggleCanvas(state) {
        if (state) {
            this.drawBlackout();
            this.toggleTextVisibility('none');
        }
        else {
            this.toggleTextVisibility('block');
            noCanvas();
        }
    }

    toggleTextVisibility(mode) {
        for (let child of this.canvasInfo.parent.children) {
            child.style.display = mode;
        }
    }

    drawBlackout() {
        this.canvasInfo.sizes = this.getCanvasInfo(this.canvasInfo.parent);
        let displacerX = this.canvasInfo.parent.offsetLeft;
        let displacerY = this.canvasInfo.parent.offsetTop;
        let canvasW = this.canvasInfo.sizes[0];
        let canvasH = this.canvasInfo.sizes[1] - displacerY;

        let blackoutBox = int(this.canvasInfo.sizes[2].split('~'));

        let blackoutCanvas = createCanvas(canvasW, canvasH);
        blackoutCanvas.class('canvas_blackout');
        blackoutCanvas.parent(this.canvasInfo.parent);

        let texts = Object.values(this.poem_word);
        let coords = Object.values(this.word_data);
        // this.goVoice(texts);

        //DRAWING
        background(255, 251, 248);
        translate(-displacerX, -displacerY);
        blackoutBox[0] -= 10;
        blackoutBox[1] -= 10;
        blackoutBox[2] += 20;
        blackoutBox[3] += 20;
        let data, offset;
        fill(5, 0, 36);
        rect(blackoutBox[0], blackoutBox[1], blackoutBox[2], blackoutBox[3]);
        for (let i = 0; i < coords.length; i++) {
            data = int(coords[i].split('~'));
            data[0]++;
            data[2]++;

            if (data[4] > 30) {
                offset = 3;
            } else {
                offset = 1;
            }

            fill(255, 251, 248);
            rect(data[0], data[1], data[2], data[3]);
            noStroke();
            fill(5, 0, 36);
            textSize(data[4]);
            textFont("Libre");
            textAlign(CENTER, CENTER);
            text(texts[i], data[0] + (data[2] / 2), data[1] + (data[3] / 2) + offset);
        }
    }

    // poop(poo){
    //     return(poo);
    // }

}    
