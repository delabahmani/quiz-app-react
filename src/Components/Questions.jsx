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
          {question.answers.map((answer, answerIndex) => (
            <button
              key={answerIndex}
              onClick={() =>
                handleAnswerClick(index, answer, question.correct_answer)
              }
              disabled={answeredQuestions[index]}
              style={{
                backgroundColor:
                  selectedAnswers[index]?.selectedAnswer === answer
                    ? answer === question.correct_answer
                      ? "green"
                      : "red"
                    : null,
              }}
            >
              {decodeHtml(answer)}
            </button>
          ))}
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

// return (
//   <div>
//     {questions.map((question, index) => (
//       <div key={index}>
//         <h1>Question: {question.question}</h1>
//         {question.answers.map((answer, answerIndex) => (
//           <div key={answerIndex}>{answer}</div>
//         ))}
//       </div>
//     ))}
//   </div>
// );

// const handleAnswerClick = (selectedAnswer, correctAnswer) => {
//   if (selectedAnswer === correctAnswer) {
//     score+=1

//   } else {
//     <p>Incorrect answer!</p>
//   }
// }
// return (
//   <div>
//       {questions.map((question, index) => (
//           <div key={index}>
//               <h1>Question: {question.question}</h1>
//               {question.answers.map((answer, answerIndex) => (
//                   <button
//                       key={answerIndex}
//                       onClick={() => handleAnswerClick(answer, question.correct_answer)}
//                   >
//                       {answer}
//                   </button>
//               ))}
//           </div>
//       ))}
//   </div>
// );
// }
