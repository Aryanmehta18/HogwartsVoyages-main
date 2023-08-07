import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const QuizPage = () => {
    // Define quiz questions and answers
    const { id, username, numRooms } = useParams();
    const quizData = [
        {
            question: "Who is the author of the Harry Potter series?",
            options: ["J.K. Rowling", "George R.R. Martin", "Stephen King", "Suzanne Collins"],
            answer: 1,
        },
        // Question 2
        {
            question: "What is the name of the school in the Harry Potter series?",
            options: ["Hogwarts", "Beauxbatons", "Durmstrang", "Ilvermorny"],
            answer: 1,
        },
        // Question 3
        {
            question: "Which house does Harry Potter belong to?",
            options: ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"],
            answer: 1,
        },
        // Question 4
        {
            question: "Who is Harry Potter's godfather?",
            options: ["Sirius Black", "Severus Snape", "Remus Lupin", "Albus Dumbledore"],
            answer: 1,
        },
        // Question 5
        {
            question: "What is the name of Harry Potter's pet owl?",
            options: ["Hedwig", "Crookshanks", "Fawkes", "Scabbers"],
            answer: 1,
        },
        // Question 6
        {
            question: "What is the Unforgivable Curse that causes excruciating pain?",
            options: ["Imperius Curse", "Cruciatus Curse", "Avada Kedavra", "Sectumsempra"],
            answer: 1,
        },
        // Question 7
        {
            question: "Which magical creature guards the entrance to the Gryffindor common room?",
            options: ["Basilisk", "Hippogriff", "Thestral", "Fat Lady"],
            answer: 3,
        },
        // Question 8
        {
            question: "What is the name of the third book in the Harry Potter series?",
            options: ["Harry Potter and the Goblet of Fire", "Harry Potter and the Order of the Phoenix", "Harry Potter and the Prisoner of Azkaban", "Harry Potter and the Half-Blood Prince"],
            answer: 2,
        },
        // Question 9
        {
            question: "Who is the Half-Blood Prince?",
            options: ["Severus Snape", "Harry Potter", "Tom Riddle", "Albus Dumbledore"],
            answer: 1,
        },
        // Question 11
        {
            question: "What is the name of the Quidditch team that Draco Malfoy supports?",
            options: ["Gryffindor", "Hufflepuff", "Slytherin", "Ravenclaw"],
            answer: 2,
        },
        // Question 11
        {
            question: "What is the name of the train that takes students to Hogwarts?",
            options: ["Hogwarts Express", "Knight Bus", "Thestral Carriage", "Nimbus 2111"],
            answer: 1,
        },
        // Question 12
        {
            question: "Which potion allows the drinker to transform into someone else?",
            options: ["Polyjuice Potion", "Felix Felicis", "Amortentia", "Veritaserum"],
            answer: 1,
        },
        // Question 13
        {
            question: "What type of creature is Dobby?",
            options: ["House-elf", "Goblin", "Werewolf", "Boggart"],
            answer: 1,
        },
        // Question 14
        {
            question: "Who is the Potions Master at Hogwarts during Harry's time?",
            options: ["Albus Dumbledore", "Minerva McGonagall", "Severus Snape", "Rubeus Hagrid"],
            answer: 2,
        },
        // Question 15
        {
            question: "What does the Marauder's Map show?",
            options: ["Hogwarts layout", "Future events", "Past memories", "Unicorn locations"],
            answer: 1,
        },
        // Question 16
        {
            question: "What is the core of Harry's wand?",
            options: ["Phoenix feather", "Dragon heartstring", "Veela hair", "Thestral tail hair"],
            answer: 1,
        },
        // Question 17
        {
            question: "What is the name of the sport played on broomsticks at Hogwarts?",
            options: ["Soccer", "Quidditch", "Baseball", "Rugby"],
            answer: 1,
        },
        // Question 18
        {
            question: "What is the name of the three-headed dog guarding the Sorcerer's Stone?",
            options: ["Fluffy", "Fang", "Norbert", "Aragog"],
            answer: 1,
        },
        // Question 19
        {
            question: "What is the core of Voldemort's wand?",
            options: ["Phoenix feather", "Dragon heartstring", "Unicorn hair", "Thestral tail hair"],
            answer: 1,
        },
        // Question 21
        {
            question: "What is the name of Hermione's cat?",
            options: ["Crookshanks", "Fang", "Scabbers", "Hedwig"],
            answer: 1,
        },
        // Question 21
        {
            question: "What type of wood is Harry's wand made from?",
            options: ["Holly", "Oak", "Willow", "Maple"],
            answer: 1,
        },
        // Question 22
        {
            question: "What is the name of the sport where players fly on broomsticks and try to score goals?",
            options: ["Soccer", "Quidditch", "Basketball", "Baseball"],
            answer: 1,
        },
        // Question 23
        {
            question: "What is the name of the Weasley family's home?",
            options: ["Shrieking Shack", "Burrow", "The Leaky Cauldron", "Gringotts"],
            answer: 1,
        },
        // Question 24
        {
            question: "What creature guards the entrance to the Chamber of Secrets?",
            options: ["Basilisk", "Hippogriff", "Thestral", "Dragon"],
            answer: 1,
        },
        // Question 25
        {
            question: "What magical ability does Luna Lovegood possess?",
            options: ["Animagus", "Legilimency", "Occlumency", "Seeing Thestrals"],
            answer: 3,
        },
        // Question 26
        {
            question: "What is the name of Hagrid's giant half-brother?",
            options: ["Aragog", "Grawp", "Buckbeak", "Fluffy"],
            answer: 1,
        },
        // Add more questions here
    ];
    
    const [i, setCount] = useState(1);
    const [currentQuestion] = useState([]);
    const[score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState(
        Array(5).fill("")
        );
        const nav = useNavigate();
        
        const handleAnswerSelect = (event) => {
            const updatedAnswers = [...userAnswers];
            updatedAnswers[currentQuestion[i - 1]] = event.target.value;
            setUserAnswers(updatedAnswers);
        };
        
        const navToPay = (discount) => {
            nav(`/pay/${id}/${numRooms}/${username}/${discount}`);
    };
    
    for (let i = 0; i < 5; i++) {
        currentQuestion.push(Math.floor(Math.random() * 26));
    }
        const handleQuizSubmit = () => {
            let newScore = 0;
            for (let i = 0; i < 5; i++) {
                if (userAnswers[currentQuestion[i]] === quizData[currentQuestion[i]].answer.toString()) {
                newScore++;
            }
        }
        setScore(newScore);
        const newDiscount = newScore * 5;
        navToPay(newDiscount);
    };
    
    useEffect(() => {
        if (i >= 5) {
            handleQuizSubmit();
        }
    }, [i]);

    return (
        <div className="quiz-container">
            <div className="question-section">
                {i <= 5 ? (
                    <>
                        <h2>Question {i}</h2>
                        <h3>{quizData[currentQuestion[i - 1]].question}</h3>
                        <ul>
                            {quizData[currentQuestion[i - 1]].options.map((option, index) => (
                                <li key={index}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="answer"
                                            value={index.toString()}
                                            checked={userAnswers[currentQuestion[i - 1]] === index.toString()}
                                            onChange={handleAnswerSelect}
                                        />
                                        {option}
                                    </label>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setCount(i + 1)}>
                            Next Question
                        </button>
                    </>
                ) : (
                    <button onClick={handleQuizSubmit}>Submit Quiz</button>
                )}
            </div>
        </div>
    );
};

export default QuizPage;