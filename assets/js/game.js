function hangman () {
    this.alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h','i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    this.cities = ['seoul','london','paris','berlin','rome','tokyo','jakarta','new delhi','beijing','amsterdam','panama city','Kuala Lumpur','washington dc'];
    this.hint = ['S.Korea','England','France','Germany','Italy','Japan','Indonesia','India','China','Netherlands','Panama','Malaysia','United States'];
    
    this.interval = 0;
    this.winCnt = 0;
    this.endFlag = 0;
    this.letter_space = 0;
    this.correctWords = [];
    this.correctWords_track = [];
    this.numberOfGuessesRemainingCount = 5;
    this.lettersAlreadyGuessed = [];
    
    this.chosen_index = 0;
    this.chosen_city = '';
    this.correct_cnt = 0;
    
    this.hint_scr = document.getElementById("hint_scr");
    this.restartInfo = document.getElementById("restartInfo");
    this.winBox = document.getElementById("winBox");
    this.correctWordsBox = document.getElementById("correctWordsBox");
    this.numberOfGuessesRemainingBox = document.getElementById("numberOfGuessesRemainingBox");
    this.lettersAlreadyGuessedBox = document.getElementById("lettersAlreadyGuessedBox");
    
    this.embed = '';
    this.bg_sound = "assets/mp3/bg.mp3";
    this.correct_sound = "assets/mp3/tick.mp3";
    this.win_sound = "assets/mp3/win.mp3";
    this.lose_sound = "assets/mp3/lose.mp3";

    this.play = function() {
        //update win count number
        this.winBox.innerHTML = this.winCnt;
        //get random index to get city name
        this.chosen_index = Math.floor(Math.random() * this.cities.length);
        //get city name as quiz
        this.chosen_city = this.cities[this.chosen_index];
        //switch space to "-"
        this.chosen_city = this.chosen_city.replace(/\s/g, "-");
        console.log(this.chosen_city);
        
        //show in current word
        for (var i = 0; i < this.chosen_city.length; i++) {
            //create span tag to give css style
            guess = document.createElement('span');
            //add class name guess
            guess.setAttribute('class', 'guess');
            //if spaces
            if (this.chosen_city[i] === "-") {
                guess.innerHTML = "-";
                //increase space count when conslude to know win or lose
                this.letter_space += 1;
            //if letters
            } else {
                guess.innerHTML = "_";
            }
            //save guess in order
            this.correctWords.push(guess);
            // append to div
            this.correctWordsBox.appendChild(guess);
        }
        this.playMp3(this.bg_sound,"true");
    }
    this.duplicate_word_cnt = function (obj, needle){
        var cnt = 0;
        for (var i = 0; i < obj.length; i++) {
            if (obj[i] != needle) {
                //cnt = 1;
            } else {
                cnt++;
            }
        }
        if (cnt > 0) {
            return cnt;
        }else{
            return 0;
        }
    }
    this.check = function (guessed_word){
        d_w_c = this.duplicate_word_cnt(this.chosen_city, guessed_word);
        for (var i = 0; i < this.chosen_city.length; i++) {
            if (this.chosen_city[i] === guessed_word) {
                //count how many same words in chose_city 
                
                //change _ to letter
                this.correctWords[i].innerHTML = guessed_word.toUpperCase();

                if(this.correctWords_track.includes(guessed_word)){
                    //don't increase correct count as already counted
                }else{
                    //save correct answer without html
                    this.correctWords_track.push(guessed_word);
                    //increase correct count when conclude to know win or lose
                    if(d_w_c > 1){
                        this.correct_cnt += d_w_c;
                    }else{
                        this.correct_cnt += 1;
                    }
                    this.playMp3(this.correct_sound,"false");
                }
            }
        }
        var j = (this.chosen_city.indexOf(guessed_word));
        //if guessed word is not in city name
        if (j === -1) {
            //if guessed word is new
            if(!this.lettersAlreadyGuessed.includes(guessed_word)){
                //save into already guessed in order
                this.lettersAlreadyGuessed.push(guessed_word);
                //decrease remaining count
                this.numberOfGuessesRemainingCount -= 1;
                if(this.numberOfGuessesRemainingCount>=0){
                    //if remaining count is less than 3
                    if(this.numberOfGuessesRemainingCount<3){
                        //get hint
                        this.getHint(this.chosen_index);
                    }
                    this.update_info();
                }
            //if user already has guessed and tried the same word
            }else{
                alert("You already tried the letter " + guessed_word + "!");
            }
        } else {
            this.update_info();
        }
    }
    //update screen
    this.update_info = function (){
        //show how many remaining count remains
        this.numberOfGuessesRemainingBox.innerHTML = this.numberOfGuessesRemainingCount;
        //if lost 
        if (this.numberOfGuessesRemainingCount < 1) {
            //game ends
            this.winBox.innerHTML = "The End";
            if(this.interval==0){
                //show flash as user can easily see that game is ended
                this.interval = setInterval(function(){this.restartInfo.classList.toggle('fade')},500);
                //stop flash after 5 secs
                //setTimeout(function(){clearInterval(this.interval);this.interval=0;this.restartInfo.classList.remove("fade");},5000);
            }
            //setup end flag
            this.endFlag=1;
            this.playMp3(this.lose_sound,"false");
        }
        //if win
        //if total number of correct count and space count is equal to correct city name's count
        if(this.correctWords.length===parseInt(this.correct_cnt)+parseInt(this.letter_space)){
            //increase win count
            this.winCnt++;
            //show win number
            this.winBox.innerHTML = this.winCnt;
            // user won and game ends
            if(this.interval==0){
                this.interval = setInterval(function(){this.restartInfo.classList.toggle('fade')},500);
                //setTimeout(function(){clearInterval(this.interval);this.interval=0;this.restartInfo.classList.remove("fade");},5000);
            }
            this.endFlag=1;
            this.playMp3(this.win_sound,"false");
        }
        //if game is still running, and got wrong guess, add into lettersAlreadyGuessedBox
        this.lettersAlreadyGuessedBox.innerHTML='';
        for(var i=0;i<this.lettersAlreadyGuessed.length;i++){
            wrongGuess = document.createElement('span');
            wrongGuess.setAttribute('class', 'guess');
            wrongGuess.innerHTML=this.lettersAlreadyGuessed[i].toUpperCase();
            this.lettersAlreadyGuessedBox.appendChild(wrongGuess);
        }
    }
    this.getHint = function (index){
        //get hint with index and show
        this.hint_scr.innerHTML = "Hint: Capital of "+ this.hint[index].toUpperCase();
    }
    //reset the game. set to default
    this.reset = function (){
        this.letter_space=0;
        this.correctWords = [];
        this.correctWords_track =[];
        this.numberOfGuessesRemainingCount = 5;
        this.lettersAlreadyGuessed = [];
        
        this.chosen_index=0;
        this.chosen_city='';
        this.correct_cnt=0;
        this.hint_scr.innerHTML="";
        this.correctWordsBox.innerHTML="";
        this.numberOfGuessesRemainingBox.innerHTML="";
        this.lettersAlreadyGuessedBox.innerHTML="";
        //after reset, play
        this.play();
    }
    this.playMp3=function(source, loop){
        this.embed=document.createElement("embed");
        this.embed.setAttribute("src",source);
        this.embed.setAttribute("hidden","true");
        this.embed.setAttribute("volume","100");
        this.embed.setAttribute("autostart","true");
        this.embed.setAttribute("loop",loop);
        document.body.appendChild(this.embed);
    }
}

var player = new hangman();
player.play();

document.onkeyup = function(event) {
    if (event.keyCode==116){
        //F5 to refresh the page
    }else{
        
        //if game ended and pressed any key to restart
        if(player.endFlag==1){
            player.endFlag=0;
            player.reset();
            if(player.interval!=0){
                clearInterval(player.interval);player.interval=0;
                player.restartInfo.classList.remove("fade");
            }
        //game is still running
        }else{
            //prevent other keys except alphabet letters
            if (event.keyCode >= 65 && event.keyCode <= 90){//a-z
                player.check(event.key.toLowerCase());
            }
        }
    }
}