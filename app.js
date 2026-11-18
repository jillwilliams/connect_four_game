const buttonEl = document.getElementById("start-game");
const playersChoiceEl = document.querySelectorAll(".players-choice");

const rowOneEl = document.querySelectorAll(".players-choice-one");
const rowTwoeEl = document.querySelectorAll(".players-choice-two");
const rowThreeEl = document.querySelectorAll(".players-choice-three");
const rowFourEl = document.querySelectorAll(".players-choice-four");
const rowFiveEl = document.querySelectorAll(".players-choice-five");
const rowSixEl = document.querySelectorAll(".players-choice-six");

const playersChoice = [c1, c2, c3, c4, c5, c6, c7];
const rowOne = [r11, r12, r13, r14, r15, r16, r17];
const rowTwo = [r21, r22, r23, r24, r25, r26, r27];
const rowThree = [r31, r32, r33, r34, r35, r36, r37];
const rowFour = [r41, r42, r43, r44, r45, r46, r47];
const rowFive = [r51, r52, r53, r54, r55, r56, r57];
const rowSix = [r61, r62, r63, r64, r65, r66, r67];

const playGame = () => {
    const playersChoiceEl = [c1, c2, c3, c4, c5, c6, c7];

    playersChoiceEl.forEach((choiceEl, index) => {
        choiceEl.addEventListener("click", () => {
            playersChoiceEl.forEach(el => el.style.backgroundColor = "");
            choiceEl.style.backgroundColor = "red";
            
            if (rowSix[index]) {
                rowSix[index].style.backgroundColor = "red";
            }
        });
    });
};

    


buttonEl.addEventListener("click", playGame)
