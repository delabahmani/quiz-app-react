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

  const onFinalAnswerSelected = (selectedAnswers) => {
    // Debugging to see if answers are being stored
    console.log("Final Answers: ", selectedAnswers);
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
    <div>
      {questions.map((question, index) => (
        <div key={index}>
          <h1>{decodeHtml(question.question)}</h1>
          {question.answers.map((answer, answerIndex) => {
            let style = {};
            if (answeredQuestions[index]) {
              if (answer === question.correct_answer) {
                style.backgroundColor = "green";
              } else if (answer === selectedAnswers[index]?.selectedAnswer) {
                style.backgroundColor = "red";
              }
            }
            return (
              <button
                key={answerIndex}
                onClick={() =>
                  handleAnswerClick(index, answer, question.correct_answer)
                }
                disabled={answeredQuestions[index]}
                style={style}
              >
                {decodeHtml(answer)}
              </button>
            );
          })}
        </div>
      ))}
      {isQuizComplete && (
        <button onClick={() => handleQuizCompletion(selectedAnswers)}>
          Submit Quiz
        </button>
      )}
    </div>
  );
}
