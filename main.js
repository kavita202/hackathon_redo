// variable declerations
let data;
let difficulty;
const answers = [];

// calling API for questions based on button clicked
const choices = {
  easy: "https://opentdb.com/api.php?amount=10&difficulty=easy&type=boolean",
  medium:
    "https://opentdb.com/api.php?amount=10&difficulty=medium&type=boolean",
  hard: "https://opentdb.com/api.php?amount=10&difficulty=hard&type=boolean",
  random: "https://opentdb.com/api.php?amount=10&type=boolean",
};

// selecting all buttons to create a node list
const options = document.querySelectorAll("button");

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

// async-await function - dependant on difficult selected
async function getData(difficulty) {
  const response = await fetch(difficulty);
  data = await response.json();
  // removing previous questions and answers
  const removeChilds = (parent) => {
    while (parent.lastChild) {
      parent.removeChild(parent.lastChild);
    }
  };
  let empty = document.querySelector("div");
  removeChilds(empty);
  // collate the data and feed into structure
  // create a framework for the question layout
  // container with question, answers
  // empty p tag to ouput correct answer if wrong
  let form = document.createElement("form");
  form.setAttribute("id", "form");
  empty.appendChild(form);
  for (let i = 0; i < 10; i++) {
    let container = document.createElement("label");
    let qu = document.createElement("p");
    qu.style.fontWeight = "600";
    qu.style.paddingLeft = "3%";
    qu.style.textIndent = "-3.4%";
    qu.innerText = htmlDecode(`${i + 1}. ${data.results[i].question}`);
    let ans = document.createElement("p");
    var responses = ["True", "False"];
    var responseHTML = "";
    responses.forEach(function (response) {
      responseHTML += `<input type="radio" value=${response} name="${i}" required="required">`;
      responseHTML += response + "<br><br>";
    });
    ans.innerHTML = `${responseHTML}`;
    ans.style.margin = "2.5%";
    var feedback = document.createElement("p");
    feedback.setAttribute("id", `feedback${i}`);
    container.appendChild(qu);
    qu.after(ans);
    container.appendChild(feedback);
    form.appendChild(container);
    answers.push(data.results[i].correct_answer);
  }
  var btn = document.createElement("button");
  btn.setAttribute("type", "submit");
  btn.setAttribute("id", "butt");
  btn.innerHTML = "Submit";
  form.appendChild(btn);

  function handleForm(event) {
    event.preventDefault();
  }
  form.addEventListener("submit", handleForm);
  form.addEventListener("submit", Results);
  let score;
  let message = document.createElement("h4");
  message.setAttribute("id", "message");
  function Results() {
    score = 0;
    message.innerHTML = "";
    btn.after(message);
    for (let i = 0; i < 10; i++) {
      const values = document.querySelectorAll(`input[name='${i}']`);
      let feedbackOutcome = document.getElementById(`feedback${i}`);
      for (val of values) {
        if (val.checked) {
          let userInput = val.value;
          if (userInput === answers[i]) {
            score++;
            feedbackOutcome.innerText = "Correct";
            feedbackOutcome.style.color = "#1fc868";
          } else if (userInput !== answers[i]) {
            feedbackOutcome.innerText = "Incorrect";
            feedbackOutcome.style.color = "#f42731";
          }
        }
      }
    }

    if (score > 7) {
      message.innerText = `Well done! You scored ${score}/10.`;
      message.style.color = "rgb(0,0,0)";
      message.style.weight = "1000";
    } else {
      message.innerText = `You scored ${score}/10, please review the answers above.`;
      message.style.color = "rgb(0,0,0)";
      message.style.weight = "1000";
    }
  }
}

// event listener iterates throught Nodelist and uses id to find API URL from choice object
options.forEach((button) => {
  button.addEventListener("click", (e) => {
    difficulty = choices[e.target.id];
    getData(difficulty);
  });
});
