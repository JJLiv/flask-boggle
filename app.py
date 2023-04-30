from flask import Flask, request, session, render_template, jsonify
from boggle import Boggle
from flask_debugtoolbar import DebugToolbarExtension


app = Flask(__name__)

app.config['SECRET_KEY'] = "secret"
toolbar = DebugToolbarExtension(app)

boggle_game = Boggle()


@app.route("/")
def show_board():
    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get('highscore', 0)
    nplays = session.get('nplays', 0)
    return render_template("index.html", board = board, highscore = highscore, nplays = nplays)


@app.route("/check-word")
def word_check():
    word = request.args['word']
    board = session['board']
    response = boggle_game.check_valid_word(board, word)
    return jsonify({'result': response})

@app.route('/post-score', methods=['POST'])
def post_score():
    score = request.json['score']
    highscore = session.get('highscore', 0)
    nplays = session.get('nplays', 0)

    session['nplays'] = nplays + 1
    session['highschore'] = max(score, highscore)

    return jsonify(brokeRecord=score > highscore)
    
    
    
