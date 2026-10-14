/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src];

  const length = copy.length;
  for (let i = 0; i < length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * length);
    const z = copy[y];
    copy[i] = z;
    copy[y] = x;
  }

  if (typeof src === "string") {
    return copy.join("");
  }

  return copy;
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const words = [
  "apple",
  "banana",
  "orange",
  "purple",
  "react",
  "school",
  "coffee",
  "summer",
  "window",
  "guitar",
];

const savedGame = localStorage.getItem("scrambleGame");
const gameData = savedGame ? JSON.parse(savedGame) : null;

function App() {
  const [gameWords, setGameWords] = React.useState(
    gameData ? gameData.gameWords : shuffle(words),
  );

  const [scrambledWord, setScrambledWord] = React.useState(
    gameData ? gameData.scrambledWord : shuffle(gameWords[0]),
  );

  const [guess, setGuess] = React.useState("");
  const [points, setPoints] = React.useState(gameData ? gameData.points : 0);
  const [strikes, setStrikes] = React.useState(gameData ? gameData.strikes : 0);
  const [passes, setPasses] = React.useState(gameData ? gameData.passes : 3);
  const [message, setMessage] = React.useState(
    gameData ? gameData.message : "",
  );

  const maxStrikes = 3;

  function guessHandler(e) {
    e.preventDefault();

    if (guess.toLowerCase() === gameWords[0].toLowerCase()) {
      setPoints(points + 1);
      setMessage("Correct!");

      const newWords = gameWords.slice(1);
      setGameWords(newWords);

      if (newWords.length > 0) {
        setScrambledWord(shuffle(newWords[0]));
      }
    } else {
      setStrikes(strikes + 1);
      setMessage("Incorrect!");
    }

    setGuess("");
  }

  function passHandler() {
    if (passes > 0) {
      const newWords = gameWords.slice(1);

      setGameWords(newWords);
      setPasses(passes - 1);
      setMessage("Passed!");

      if (newWords.length > 0) {
        setScrambledWord(shuffle(newWords[0]));
      }
    }
  }

  const gameOver = gameWords.length === 0 || strikes >= maxStrikes;

  function restartHandler() {
    const newWords = shuffle(words);

    setGameWords(newWords);
    setScrambledWord(shuffle(newWords[0]));
    setGuess("");
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setMessage("");
  }

  React.useEffect(() => {
    const game = {
      gameWords: gameWords,
      scrambledWord: scrambledWord,
      points: points,
      strikes: strikes,
      passes: passes,
      message: message,
    };

    localStorage.setItem("scrambleGame", JSON.stringify(game));
  }, [gameWords, scrambledWord, points, strikes, passes, message]);

  return (
    <div>
      <h1>Scramble</h1>

      {gameOver ? (
        <div>
          <h2>Game Over</h2>
          <button onClick={restartHandler}>Play Again</button>
        </div>
      ) : (
        <React.Fragment>
          <h2>{scrambledWord}</h2>

          <form onSubmit={guessHandler}>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
            />
          </form>

          <button onClick={passHandler}>Pass</button>
        </React.Fragment>
      )}

      <p>Points: {points}</p>
      <p>Strikes: {strikes}</p>
      <p>Passes: {passes}</p>
      <p>{message}</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
