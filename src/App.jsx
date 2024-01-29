import { useState, useEffect } from "react";
import Settings from "./Components/Settings";
import Question from "./Components/Questions";
import Score from "./Components/Score";
import decodeHtml from "./Components/Utils";

import "./App.css";

function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [showGenerateButton, setShowGenerateButton] = useState(true);
  const [showSettings, setShowSettings] = useState(true);
  const [isCooldown, setIsCooldown] = useState(false);
  const [regenerationCount, setRegenerationCount] = useState(0);
  const regenerationLimit = 3;
  const [userAnswers, setUserAnswers] = useState({});
  const [showResultsScreen, setShowResultsScreen] = useState(false);
  const [totalAttemptedQuestions, setTotalAttemptedQuestions] = useState(0);
  const [allQuestions, setAllQuestions] = useState([]);
  const [allUserAnswers, setAllUserAnswers] = useState({});

  useEffect(() => {
    console.log("Updated allQuestions:", allQuestions);
  }, [allQuestions]);

  // Reset Quiz
  const resetQuiz = () => {
    setQuestions([]);
    setScore(0);
    setShowGenerateButton(true);
    setShowSettings(true);
    setQuizStarted(false);
    setRegenerationCount(0);
    setShowResultsScreen(false);
    setAllQuestions([]);
    setAllUserAnswers({});
    setTotalAttemptedQuestions(0);
  };

  // User Input Parameters
  const [qParam, setQParam] = useState({
    amount: "10",
    category: "",
    difficulty: "",
  });

  function handleAmount(event) {
    setQParam((prevState) => ({
      ...prevState,
      amount: event.target.value,
    }));
  }

  function handleCategory(event) {
    setQParam((prevState) => ({
      ...prevState,
      category: event.target.value,
    }));
  }

  function handleDifficulty(event) {
    setQParam((prevState) => ({
      ...prevState,
      difficulty: event.target.value,
    }));
  }

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleQuizCompletion = (selectedAnswers) => {
    // Debugging to see if answers are being stored
    console.log("Received Answers in handleQuizCompletion:", selectedAnswers);
    // setUserAnswers({ ...selectedAnswers, selectedAnswers });
    setAllUserAnswers((prev) => ({ ...prev, ...selectedAnswers }));
    console.log("Regeneration Count:", regenerationCount);

    console.log("Showing results screen");
    console.log("Rendering results screen with allQuestions:", allQuestions);
    setShowResultsScreen(true);
    setShowGenerateButton(false);
    setShowSettings(false);
  };

  async function fetchTrivia() {
    if (parseInt(qParam.amount) < 10 || parseInt(qParam.amount) > 20) {
      console.error("Invalid number of questions");
      return;
    }

    if (isCooldown) {
      console.error("Please wait before regenerating the quiz.");
      return;
    }

    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 15000);
    if (regenerationCount <= regenerationLimit) {
      try {
        setRegenerationCount((prevCount) => prevCount + 1);
        const response = await fetch(
          `https://opentdb.com/api.php?amount=${qParam.amount}&category=${qParam.category}&difficulty=${qParam.difficulty}&type=multiple`
        );
        const data = await response.json();
        console.log(data);
        setTotalAttemptedQuestions((prev) => prev + data.results.length);
        function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
          }
        }

        const newQuestions = data.results;
        setAllQuestions((prev) => [...prev, ...newQuestions]);
        console.log(allQuestions);

        const formattedQuestions = data.results.map((question) => {
          const answers = [
            question.correct_answer,
            ...question.incorrect_answers,
          ];
          shuffleArray(answers);

          return {
            ...question,
            answers,
          };
        });
        setQuestions(formattedQuestions);
      } catch (err) {
        console.log("Oops! Something went wrong!", err);
      }
      setShowGenerateButton(false);
      setShowSettings(false);
    }
  }

  const handleGenerate = () => {
    startQuiz();
    fetchTrivia();
  };

  const addAnswer = (selectedAnswers) => {
    setAllUserAnswers({ ...selectedAnswers, selectedAnswers });
  };

  const regenerateQuiz = async () => {
    handleGenerate();
    setShowGenerateButton(false);
    setShowSettings(false);
  };

  return (
    <div>
      {showSettings && (
        <div>
          <Settings
            handleAmount={handleAmount}
            handleCategory={handleCategory}
            handleDifficulty={handleDifficulty}
            qParam={qParam}
            showQParam={!quizStarted}
          />
        </div>
      )}
      {showGenerateButton && (
        <button onClick={handleGenerate}>Generate Quiz</button>
      )}
      {quizStarted && !showResultsScreen && (
        <div>
          <Question
            qParam={qParam}
            questions={questions}
            score={score}
            setScore={setScore}
            handleQuizCompletion={handleQuizCompletion}
          />
          <Score score={score} totalQuestions={totalAttemptedQuestions} />
        </div>
      )}
      {!showGenerateButton && !showResultsScreen && (
        <>
          <button onClick={resetQuiz}>Reset Quiz</button>
          {regenerationCount !== regenerationLimit ? (
            <button
              onClick={() => {
                regenerateQuiz();
                addAnswer(userAnswers);
              }}
            >
              Regenerate Quiz
            </button>
          ) : (
            ""
          )}
          {isCooldown && (
            <p>Please wait 15 secs before regenerating the quiz! :D</p>
          )}
        </>
      )}

      {showResultsScreen && (
        <div>
          <h1>
            Your Score: {score}/{questions.length}
          </h1>
          <button onClick={resetQuiz}>Reset Quiz</button>
        </div>
      )}
    </div>
  );
}

export default App;
