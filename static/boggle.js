

    class BoggleGame {
        constructor(boardID, secs = 60){
            this.secs = secs;
            this.showTimer();
            this.board = $("#" + boardID)
            this.words = new Set();
            this.score = 0;

            this.timer = setInterval(this.tick.bind(this), 1000);

            $(".add-word", this.board).on("submit", this.HandleSubmit.bind(this));

        }

        showScore(){
            $(".score", this.board).text(this.score);
        }


        showWord(word){
            $('.words', this.board).append($('<li>', {text:word}));
        }

        showMessage(msg, cls){
            $('.msg', this.board)
            .text(msg)
            .removeClass()
            .addClass(`msg ${cls}`);
        }


        async HandleSubmit(evt){
            evt.preventDefault();

            const $word =$("#word", this.board); 
            let word = $word.val();
            

            if(!word){
                return
            }
            if (this.words.has(word)){
                console.log("word used already");
                return;
            }


            const response = await axios({
                method: "GET",
                url: "/check-word",
                data: {word: word}
            }) ;
            
            if (response.data.result === "not-word"){
                console.log("thats not a word");
            }
            else if(response.data.result === "not-on-board"){
                console.log("no such word on board");
            }
            else {
                console.log("goodjob")
                this.showWord(word);
            }
                
            $word.val('').focus();

        }

        showTimer(){
            $('.timer', this.board).text(this.secs);
        }

        async tick(){
            this.secs -= 1;
            this.showTimer();

            if(this.secs === 0){
                clearInterval(this.timer);
                await this.scoreGame();
            }
        }

        async scoreGame(){
            $('.add-word', this.board).hide();
            const response = await axios.post('/post-score', {score:this.score});
            if(response.data.brokeRecord){
                this.showMessage(`New Record: ${this.score}`, 'ok');
            }
            else {this.showMessage(`Final score: ${this.score}`, 'ok')};
            
        }
    }

    
    
        




   