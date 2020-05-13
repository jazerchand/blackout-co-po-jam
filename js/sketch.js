let c_url1 = './corpus/1.txt';
let c_url2 = './corpus/2.txt';
let c_url3 = './corpus/3.txt';

let corpus;
let corpuses = [];

let rita = RiTa;

let p_url = './corpus/model.txt';
let poetry_sample;

let modes = ['Hu', 'Co', 'Sy', 'Al', 'Sb', 'De'];

let corpus_keys = [0, 1, 2];
let corpus_selected;

let grammars = [
    ['prp', 'vbd', 'dt', 'nn'],    //Robot Frost
    ['dt', 'nn', 'in', 'nn'],      //Emily Dickinbot
    ['in', 'dt', 'jj', 'nn'],      //Edgar Alan Turing
    ['in', 'prp$', 'nn']          //William Carlos Williams Carloss
]

let botnames = {
    'prp,vbd,dt,nn': 'Robot_Frost',
    'dt,nn,in,nn': 'Emily_Dickinbot',
    'in,dt,jj,nn': 'Edgar_Alan_Turing',
    'in,prp$,nn': 'William_Carlos_Williams_Carloss'
}


let printer, computer, human;


function preload() {
    corpuses[0] = loadStrings(c_url1);
    corpuses[1] = loadStrings(c_url2);
    corpuses[2] = loadStrings(c_url3);
    poetry_sample = loadStrings(p_url);
}

function setup() {
    noCanvas();
    getMode();
}

function getMode() {

    corpus_selected = random(corpus_keys);
    corpus = corpuses[corpus_selected];

    let buttons = document.querySelectorAll('.mli');
    let mode;
    //ACTIVATE COMPUTER BY DEFUALT
    runMode("Hu");
    updateState(buttons, buttons[0]);
    //
    for (let b of buttons) {
        b.addEventListener('click', function () {
            if (b.dataset.state != '1') {
                mode = b.dataset.mode;
                updateState(buttons, b);
                runMode(mode);
            }
        });
    }
}

function updateState(buttons, selected) {
    for (let b of buttons) {
        if (b != selected) {
            b.dataset.state = '0';
            b.classList.remove('mli_active');
            b.previousElementSibling.style.opacity = 0;
        }
        else {
            b.dataset.state = '1';
            b.classList.add('mli_active');
            b.previousElementSibling.style.opacity = 1;
        };
    }
}

function runMode(m) {
    createCanvas(0, 0);
    switch (m) {
        case "Hu": {
            console.log("Humans doing blabla");

            printer = new Printer(corpus);
            printer.showText('.panel_top', 1, 1);
            printer.showBlackoutButtons('.panel_footer', 'Human' + '_c' + (corpus_selected + 1));

            let interactables = document.getElementsByClassName('word');
            human = new Human(interactables, printer);
        }
            break;

        case "Co": {
            console.log("Computer doing blabla");

            let grammar = random(grammars);
            let bot = botnames[grammar.toString()];
            console.log("^", bot);

            printer = new Printer(corpus);
            printer.showText('.panel_top', 1, 1);
            printer.showBlackoutButtons('.panel_footer', bot + '_c' + (corpus_selected + 1));

            let interactables = document.getElementsByClassName('word');
            computer = new Computer(corpus, interactables);
            computer.generatePoems(2, grammar);
            computer.runAnimation(printer);

        }
            break;

        case "Sy": {
            console.log("Both doing blabla #1");

            printer = new Printer(corpus);
            printer.showText('.panel_top', 1, 1);
            printer.showBlackoutButtons('.panel_footer', 'Synt' + '_c' + (corpus_selected + 1));

            let interactables = document.getElementsByClassName('word');
            // human = new Human(interactables, printer);

            computer = new Computer(corpus, interactables);
            let style = computer.learnStyle(poetry_sample, 3); //(corpus,n-factor)
            computer.selectWord(style, printer);

        }
            break;

        case "Al": {
            console.log("Alien doing blabla");

            printer = new Printer(corpus);
            printer.showText('.panel_top', 1, 1);
            printer.showBlackoutButtons('.panel_footer', 'Alie' + '_c' + (corpus_selected + 1));

            let interactables = document.getElementsByClassName('word');
            let alien = new Alien(interactables);
            alien.selectVisually('Wave', '.panel_top', printer);

        }
            break;

        case "Sb": {
            console.log("Both doing blabla #2");

            printer = new Printer(corpus);
            printer.showText('.panel_top', 1, 1);
            printer.showBlackoutButtons('.panel_footer', 'Symb' + '_c' + (corpus_selected + 1));

            let interactables = document.getElementsByClassName('word');
            human = new Human(interactables, printer);

            computer = new Computer(corpus, interactables);
            let style = computer.learnStyle(poetry_sample, 3); //(corpus,n-factor)
            computer.suggestWords(style, printer);

        }
            break;

        case "De": {
            console.log("None doing blabla");
        }
            break;

        default:
            break;
    }
};




//frankenstein
//in prp$ nn

// only selected 3 even though array had 16 first words