class Computer {
    constructor(temp_corpus, tempInteractables) {
        this.tokens = temp_corpus.join(" ").split(/\W+/);
        this.pos = this.getPOS();
        this.poem_keys = [];
        this.wordspans = this.getSelection(tempInteractables);
        // this.vocab = {}; //OVERWRITES SAME WORD P
        // console.log(this.pos);
    }

    getPOS() {
        this.tokens.pop(); //DELETE " " AT THE END OF ARRAY
        let tempPos = [];
        for (let t of this.tokens) {
            tempPos.push(rita.getPosTags(t)[0]);
            // this.vocab[t] = rita.getPosTags(t)[0]; ////OVERWRITES SAME WORD 
        }
        return tempPos;
    }

    generatePoems(line_count, g_rule) {
        // console.log(g_rule);
        let first_keys = [];
        let last_keys = [];

        let current_fpos = 0;
        for (let rule of g_rule) {
            let flag = false;
            for (let i = current_fpos; i < this.pos.length; i++) {
                if (flag) {
                    break;
                };
                if (rule == this.pos[i]) {
                    first_keys.push(i);
                    current_fpos = i + 1;
                    flag = true;
                };
            }
        }

        let current_lpos = this.pos.length - 1;
        for (let i = g_rule.length - 1; i >= 0; i--) {
            let flag = false;
            for (let j = current_lpos; j >= 0; j--) {
                if (flag) {
                    break;
                };
                if (g_rule[i] == this.pos[j]) {
                    last_keys.push(j);
                    current_lpos = j - 1;
                    flag = true;
                };
            }
        }
        // console.log(first_keys);
        last_keys = last_keys.reverse();
        // console.log(last_keys);
        // this.poem_keys = first_keys.concat(last_keys);
        // this.poem_keys = this.selectRandomPoem(g_rule, first_keys, last_keys);
        this.poem_keys = this.getAllPoems(line_count, g_rule, first_keys, last_keys);
        // console.log(this.tokens);
        // console.log(this.poem_keys);
        // console.log("~");
        // this.printpoem(first_keys);
        // this.printpoem(last_keys);
        // console.log("~");
    }

    printpoem(poem) {
        let l1 = [];
        for (let w of poem) {
            l1.push(this.tokens[w]);
        }
        l1 = l1.join(" ");
        // console.log(l1);
    }

    getSelection(tempInteractables) {
        let wordspans = [];
        for (let span of tempInteractables) {
            if (/\w+/g.test(span.innerText)) {
                wordspans.push(span);
            }
        }
        return wordspans;
    }

    runAnimation(tempPrinter) {

        setTimeout(() => {
            //INSTANT
            // for (let i = 0; i < this.wordspans.length; i++) {
            //     this.wordspans[i].classList.add('c_assign');     
            // }

            //INTERPOLATED
            let j = 0;
            let animate = setInterval(() => {
                if (j == this.wordspans.length - 1) {
                    clearInterval(animate);
                }
                this.wordspans[j].classList.add('c_assign');
                j++;
            }, 1);

        }, 0);

        setTimeout(() => {
            //INSTANT
            // for (let i = 0; i < this.wordspans.length; i++) {
            //     this.wordspans[i].classList.remove('c_assign');     
            // }

            // INTERPOLATED
            let j = 0;
            let animate = setInterval(() => {
                if (j == this.wordspans.length - 1) {
                    clearInterval(animate);
                }
                this.wordspans[j].classList.remove('c_assign');
                j++;
            }, 1);
        }, 300);

        setTimeout(() => {
            //INSTANT
            // for (let i = 0; i < this.poem_keys.length; i++) {
            //     let word_index = this.poem_keys[i];
            //     tempPrinter.highlightWord(this.wordspans[word_index], word_index, 'c_select');
            // }

            // INTERPOLATED
            let j = 0;
            let animate = setInterval(() => {
                if (j == this.poem_keys.length - 1) {
                    clearInterval(animate);
                }
                let word_index = this.poem_keys[j];
                tempPrinter.highlightWord(this.wordspans[word_index], word_index, 'c_select');
                j++;
            }, 200);
        }, 50);

        //AUTOBLACKOUT
        // setTimeout(() => {
        //     tempPrinter.autoBlackout();
        // }, 3000);
    }

    getAllPoems(line_count, g_rule, first_keys, last_keys) {
        let grammarMatches = [];
        for (let rule_index = 0; rule_index < g_rule.length; rule_index++) {
            let keys = [];
            for (let i = first_keys[rule_index]; i <= last_keys[rule_index]; i++) {
                if (this.pos[i] == g_rule[rule_index]) {
                    keys.push(i);
                }
            }
            grammarMatches.push(keys);
        }

        // console.log(grammarMatches);

        let combos = {};
        for (let i = 0; i < grammarMatches[0].length; i++) {
            if (combos[grammarMatches[0][i]] == undefined) {
                combos[grammarMatches[0][i]] = [];
            }
        }

        for (let i = 0; i < grammarMatches[0].length; i++) {
            let key = grammarMatches[0][i];
            for (let j = 0; j < grammarMatches[1].length; j++) {
                if (grammarMatches[1][j] > key) {
                    combos[key].push([key, grammarMatches[1][j]]);
                }
            }
        }

        for (let ig = 2; ig < grammarMatches.length; ig++) {
            for (let i = 0; i < grammarMatches[0].length; i++) {
                let key = grammarMatches[0][i];
                let tempCombo = [];
                for (let j = 0; j < combos[key].length; j++) {
                    tempCombo.push(combos[key][j]);
                }
                combos[key] = [];
                // console.log(tempCombo);
                for (let j = 0; j < tempCombo.length; j++) {
                    let last = tempCombo[j].slice(-1);
                    for (let k = 0; k < grammarMatches[ig].length; k++) {
                        if (grammarMatches[ig][k] > last) {
                            let concat = tempCombo[j].concat(grammarMatches[ig][k]);
                            combos[key].push(concat);
                        }
                    }
                }
            }
        }
        return this.selectRandomPoem_alt(combos, line_count);
    }

    selectRandomPoem_alt(sentence_combos, count) {
        let sentence_keys = Object.keys(sentence_combos);
        let portions = getPortions();
        let poems = [];
        // let words = this.tokens;
        // console.log(sentence_combos);
        // console.log(portions);
        getKeys();
        // console.log(poems);

        function getPortions() {
            let tempP = [];
            let length = sentence_keys.length;
            for (let i = 0; i < count; i++) {
                let tempKeys = sentence_keys.slice(length * (i / count), length * ((i + 1) / count));
                tempP.push(tempKeys);
            }
            return tempP;
        }

        function getKeys() {

            function selectKey(lastkey_limit, i) {
                let try_count = 1;
                let selection;
                let flag = false;

                while (!flag) {
                    // console.log("Selection try #", try_count);
                    let selected_key = random(portions[i]);
                    let selectedCombo = Object.values(sentence_combos[selected_key]);
                    let last_val = selectedCombo[0][selectedCombo[0].length - 1];
                    // console.log("selected ", selected_key);
                    // console.log("B4 cut", selectedCombo);
                    // console.log("last word", last_val);
                    selection = [selected_key, selectedCombo];
                    if (!lastkey_limit || last_val < lastkey_limit) {
                        flag = true;
                    }
                    try_count++;
                }
                return selection;
            }

            for (let i = 0; i < portions.length; i++) {

                let lastkey_limit = false;
                if (i != portions.length - 1) {
                    lastkey_limit = int(portions[i + 1][0]);
                }

                let selection = selectKey(lastkey_limit, i);

                let selected_key = selection[0];
                let selectedCombo = selection[1];


                // console.log("Limiter ", lastkey_limit);

                let selectedComboTemp = [];
                if (lastkey_limit) {
                    // console.log("Reducing..");
                    for (let val of selectedCombo) {
                        if (val[val.length - 1] < lastkey_limit) {
                            selectedComboTemp.push(val);
                        }
                    }
                    selectedCombo = selectedComboTemp;
                    selectedComboTemp = [];
                }
                // console.log(selectedCombo);
                // console.log("Af cut", selectedCombo.length);
                if (selectedCombo.length > 0) {
                    poems = poems.concat(selectOne(selectedCombo));
                }
            }
        }

        function selectOne(selectedCombo) {
            let valid = false;
            let poem = [];
            // console.log(words);
            while (!valid) {
                let sentence = random(selectedCombo);
                //ADD CODE HERE FOR CUSTOM VALIDITY
                for (let word of sentence) {
                    // console.log(words[word]);
                }
                poem = sentence;
                valid = true;
            }

            // console.log(selectedCombo);
            return poem;
        }

        this.printpoem(poems);
        return poems;
    }

    //DELETE IF ALL GOES WELL
    selectRandomPoem(g_rule, first_keys, last_keys) {
        let grammarKeys = [];
        for (let rule_index = 0; rule_index < g_rule.length; rule_index++) {
            let keys = [];
            for (let i = first_keys[rule_index]; i <= last_keys[rule_index]; i++) {
                if (this.pos[i] == g_rule[rule_index]) {
                    // console.log(g_rule[rule_index],this.wordspans[i]);
                    keys.push(i);
                }
            }
            grammarKeys.push(keys);
        }

        let randomPoem = [];
        let sliceStart = 0;
        // console.log(grammarKeys);
        // console.log("sliced", grammarKeys[0]); 
        for (let i = 0; i < grammarKeys.length; i++) {
            let sliced = grammarKeys[i].slice(sliceStart, grammarKeys[i].length);
            let randomIndex = random(sliced);
            randomPoem.push(randomIndex);
            // console.log(randomIndex);
            // console.log(grammarKeys[i], sliceStart, randomIndex, sliced);
            if (i < grammarKeys.length - 1) {
                for (let j = 0; j < grammarKeys[i + 1].length; j++) {
                    if (grammarKeys[i + 1][j] > randomIndex) {
                        sliceStart = j;
                        break;
                    }
                }
            }

        }
        return randomPoem;
    }
    //^^^

    //MARKOVIT
    learnStyle(poetry_model, n_factor) {
        let model_words = poetry_model.join(" ");
        let model_pos = rita.getPosTags(model_words);
        let model_temp = [];
        //Strip Punctuation
        for (let word of model_pos) {
            if (!rita.isPunctuation(word)) {
                model_temp.push(word);
            }
        }
        let markov_model = new RiMarkov(n_factor);
        markov_model.loadTokens(model_temp, false);
        return markov_model;
    }

    selectWord(model, tempPrinter) {
        let h_record = [];
        let c_record = [];
        for (let i = 0; i < this.wordspans.length; i++) {
            this.wordspans[i].addEventListener('click', function (e) {
                let selected_word = rita.getPosTags(e.target.innerText);
                let options = model.getCompletions(selected_word);
                let matches = this.getNextPossible(4, options, i);
                let word_index = random(matches);
                this.passPoetry(i, word_index, tempPrinter, h_record, c_record);
            }.bind(this));
        }
    }

    getNextPossible(count, options, start_index) {
        // let grammar = options[0];
        let options_key = 0;
        let match_counter = 0;
        let matches = [];
        let flag = false;
        while (!flag) {
            for (let i = start_index; i < this.pos.length; i++) {
                if (match_counter >= count) {
                    break;
                }
                if (this.pos[i] == options[options_key]) {
                    matches.push(i);
                    match_counter++;
                }
            }
            if (matches.length) {
                flag = true;
            }
            options_key++;
        }
        return matches;
    }

    passPoetry(i, word_index, tempPrinter, h_record, c_record) {
        if (!c_record.includes(i) && !h_record.includes(i)) {
            let start_index = 0;
            if (h_record.length) {
                start_index = c_record[c_record.length - 1] + 1;
            }

            for (let j = start_index; j < word_index; j++) {
                if (j != i) {
                    tempPrinter.toggleWord(this.wordspans[j], 'd_select');
                }
            }
            if (i != word_index) {
                tempPrinter.highlightWord(this.wordspans[word_index], word_index, 'c_select');
            }
            tempPrinter.highlightWord(this.wordspans[i], i, 'h_select');
            h_record.push(i);
            c_record.push(word_index);
        }
        else if (h_record.includes(i)) {
            console.log("clear karoge?!");
            let index = h_record.indexOf(i);
            console.log(index);

            let start_index = 0;
            if (index != 0) {
                start_index = c_record[index - 1];
            }

            for (let j = start_index; j < c_record[c_record.length - 1]; j++) {
                if (!h_record.includes(j) && !c_record.includes(j)) {
                    tempPrinter.toggleWord(this.wordspans[j], 'd_select');
                }
            }

            for (let j = index; j < h_record.length; j++) {
                if (i != word_index) {
                    tempPrinter.highlightWord(this.wordspans[c_record[j]], c_record[j], 'c_select');
                }
                tempPrinter.highlightWord(this.wordspans[h_record[j]], h_record[j], 'h_select');
            }

            h_record.splice(index);
            c_record.splice(index);

        }
        // console.log(h_record, c_record);
    }

    //MARKOV SYMBIOSIS

    suggestWords(model, tempPrinter) {
        let words = [];
        let suggestions = [];
        for (let i = 0; i < this.wordspans.length; i++) {
            this.wordspans[i].addEventListener('click', function (e) {
                if (!words.includes(i)) {
                    words.push(i);
                    let pos_tag = rita.getPosTags(e.target.innerText);
                    let n_grams = model.getCompletions(pos_tag);
                    console.log(n_grams);
                    let new_suggestion = this.getNextPossible_alt(2, n_grams, i);
                    console.log(new_suggestion);
                    this.toggleSuggestion(suggestions, suggestions.length - 1, tempPrinter);
                    suggestions.push(new_suggestion);
                    this.toggleSuggestion(suggestions, suggestions.length - 1, tempPrinter);
                } else {
                    let record_i = words.indexOf(i);
                    if (record_i == words.length - 1) {
                        this.toggleSuggestion(suggestions, suggestions.length - 1, tempPrinter);
                        suggestions.splice(record_i, 1);
                        this.toggleSuggestion(suggestions, suggestions.length - 1, tempPrinter);
                        //toggle latest suggestion
                        //delete latest suggestion
                        //toggle latest suggestion
                    } else {
                        //delete that suggestion
                        suggestions.splice(record_i, 1);
                    }
                    //delete that word
                    words.splice(record_i, 1);
                }
                console.log(words, suggestions);
            }.bind(this));
        }
    }

    toggleSuggestion(suggestions, index, tempPrinter) {
        if (suggestions.length) {
            for (let i = 0; i < suggestions[index].length; i++) {
                let j = suggestions[index][i];
                tempPrinter.toggleWord(this.wordspans[j], 'c_suggest');
            }
        }
    }

    getNextPossible_alt(count, options, start_index) {
        // let grammar = options[0];
        // start_index++;
        let options_key = 0;
        let match_counter = 0;
        let max = count * 2;
        let matches = [];
        let words = [];
        let flag = false;
        for (let j = 0; j < options.length; j++) {
            match_counter = 0;
            console.log("finding matches for", options[j]);
            if (matches.length >= max) {
                console.log("found enough..ending");
                break;
            }
            for (let i = start_index; i < this.pos.length; i += 3) {
                if (match_counter >= count) {
                    break;
                }
                if (this.pos[i] == options[j] && !words.includes(this.tokens[i].toLowerCase()) && i != start_index) {
                    matches.push(i);
                    words.push(this.tokens[i].toLowerCase());
                    match_counter++;
                }
            }
            console.log("found " + match_counter + " matches for ", options[j]);
            console.log(matches.length + " total matches");
        }
        if (matches.length > max) {
            console.log("cutting..");
            let splice_count = matches.length - max;
            matches.splice(max - 1, splice_count);
            console.log(matches);
        }
        return matches;
    }

}