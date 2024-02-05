import { useState, useEffect } from "react";
import Settings from "./Settings";
import decodeHtml from "./Utils";

export default function Question({
  questions,
  score,
  setScore,
  handleQuizCompletion,
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const resetQuestionState = () => {
    setSelectedAnswers({});
    setAnsweredQuestions({});
  };

  useEffect(() => {
    resetQuestionState();
  }, [questions]);

  const handleAnswerClick = (questionIndex, selectedAnswer, correctAnswer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: { selectedAnswer, correctAnswer },
    }));

    setAnsweredQuestions((prev) => ({
      ...prev,
      [questionIndex]: true,
    }));

    if (selectedAnswer === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    // Debugging to see if answers are being stored
    console.log(
      "Current Question Index:",
      questionIndex,
      "Total Questions:",
      questions.length
    );

    if (questionIndex === questions.length - 1) {
      setIsQuizComplete(true);
    }
  };

  return (
    <div className="q-return-div">
      {questions.map((question, index) => (
        <div className="question-container" key={index}>
          <h1 className="question-h1">{decodeHtml(question.question)}</h1>
          <div className="answers-container">
            {question.answers.map((answer, answerIndex) => {
              let style = {};
              if (answeredQuestions[index]) {
                if (answer === question.correct_answer) {
                  style.backgroundColor = "green"
                  style.color = "white";
                } else if (answer === selectedAnswers[index]?.selectedAnswer) {
                  style.backgroundColor = "red"
                  style.color = "white";
                }
              }
              return (
                <div className="answers">
                  <button
                    className="answers-btn"
                    key={answerIndex}
                    onClick={() =>
                      handleAnswerClick(index, answer, question.correct_answer)
                    }
                    disabled={answeredQuestions[index]}
                    style={style}
                  >
                    {decodeHtml(answer)}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {isQuizComplete && (
        <button
          className="submit-btn"
          onClick={() => handleQuizCompletion(selectedAnswers)}
        >
          Submit Quiz
        </button>
      )}
    </div>
  );
}
