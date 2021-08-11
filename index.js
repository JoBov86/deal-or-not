const vals = [1, 2, 3, 4, 5, 6, 7, 8, 10, 15, 20, 25, 50, 100, 150, 200];
vals.sort((a, b) => a - b);
let sideVal = [];
let val2 = [];
let holdingArray = [];
let offers = [8, 4, 12, 2, 1].filter((x) => x < vals.length);
offers.sort((a, b) => b - a);
const snd = new Audio("sound.mp3");
const boxOpenSound = new Audio("open-box.wav");
const winSound = new Audio("win-sound.wav");
const loseSound = new Audio("lose-sound.wav");

const pageModal1 = document.querySelector(".modal1");
const pageModal2 = document.querySelector(".modal2");
const modalBody = document.querySelector(".modal-body");
const modalBody2 = document.querySelector(".modal-body2");
const start = document.querySelector(".start");
const con = document.querySelector(".game-area");
const main = document.querySelector(".main");
const leftSide = document.querySelector(".left-side");
const rightSide = document.querySelector(".right-side");
const myBox = document.querySelector(".my-box");
document.querySelector(".deal").addEventListener("click", makeDeal);
document.querySelector(".no-deal").addEventListener("click", makeDeal);
document.querySelector(".close").addEventListener("click", closePopUp);

start.addEventListener("click", startGame);

let inPlay = false;
let lastOffer;
let offerMade;
let offer = 0;
let checkedBoxes = 0;
let sel;

window.onclick = function (e) {
  if (e.target == pageModal1) {
    closePopUp();
  }
};

function endGame() {
  console.log("GAME OVER !!!!!!!!!!!!!");
  inPlay = false;
  start.style.display = "block";
  let stillHidden = document.querySelectorAll(".case");
  stillHidden.forEach(function (el) {
    if (!el.classList.contains("muted")) {
      el.textContent = `£${el.val}`;
      el.classList.add("reveal");
    }
  });
  for (let x = 0; x < vals.length; x++) {
    if (x < vals.length / 2) {
      leftSide.removeChild(sideVal[x]);
    } else {
      rightSide.removeChild(sideVal[x]);
    }
  }
  myBox.innerHTML = "";
}

function makeDeal(e) {
  console.log(e.target.textContent);
  pageModal2.style.display = "none";
  if (e.target.textContent == "Accept") {
    if (sel < offer) {
      popUp(
        `<div>Great Deal! You Won <h1>£${offer}</h1><p>Your box only contained £${sel}</p></div>`
      );
      winSound.play();
    }
    if (sel > offer) {
      popUp(
        `<div>Oops, Bad Deal! You Won <h1>£${offer}</h1><p>But your box contained £${sel}</p></div>`
      );
      loseSound.play();
    }

    endGame();
  } else if (lastOffer) {
    if (sel < offer) {
      popUp(
        `<div>Should have taken the deal, Your Box Contains <h1>£${sel}</h1></div>`
      );
      loseSound.play();
    }
    if (sel > offer) {
      popUp(`<div> Hurray, Your Box Contains <h1>£${sel}</h1></div>`);
    }
    winSound.play();

    endGame();
  }
}

function startGame() {
  start.style.display = "none";

  buildGameBoard();
  lastOffer = false;
  inPlay = true;
  offerMade = 0;
  popUp(`<h1>Select A Case</h1>`);
}

function popUp(message) {
  pageModal1.style.display = "block";
  modalBody.innerHTML = message;
}
function popUp2(message) {
  pageModal2.style.display = "block";
  modalBody2.innerHTML = message;
}

function closePopUp() {
  pageModal1.style.display = "none";

  if (holdingArray.length == offers[offerMade]) {
    makeOffer();
    offerMade++;
    let tempCaseNext;
    if (offerMade != offers.length) {
      tempCaseNext = `<p>Or Select ${
        offers[offerMade - 1] - offers[offerMade]
      } more boxes</p>`;
    } else {
      tempCaseNext = "<p>Final Offer</p>";
      lastOffer = true;
    }
    popUp2(
      `<div>Offer #${offerMade}</div><h1>£${Math.round(offer).toFixed(
        2
      )}</h1>${tempCaseNext}`
    );
  }
}

function buildGameBoard() {
  //build board

  sideVal = [];
  val2 = vals.slice(0);
  con.innerHTML = "";
  holdingArray = [];
  main.style.width = window.innerWidth + "px";
  let tempCon = con.getBoundingClientRect();
  let tempSide = rightSide.getBoundingClientRect();
  let spacer = tempCon.width / 4 - 10;
  let ver = tempCon.top + 10;
  let hor = tempCon.left - spacer / 1.2;
  let sideTop = 0;
  let leftHor = tempSide.width / 3;
  for (let x = 0; x < vals.length; x++) {
    sideVal[x] = document.createElement("div");
    sideVal[x].classList.add("sideVal");
    sideVal[x].textContent = `£${vals[x]}`;
    sideVal[x].style.left = leftHor + "px";
    sideVal[x].style.top = sideTop + "px";
    sideTop += 40;

    if (x < vals.length / 2) {
      leftSide.appendChild(sideVal[x]);
    } else {
      rightSide.appendChild(sideVal[x]);
    }

    let maker = document.createElement("div");
    let ranIndex = Math.floor(Math.random() * val2.length);
    let temp = val2.splice(ranIndex, 1)[0];
    holdingArray.push(temp);

    hor += spacer;
    maker.val = temp;
    maker.ind = x + 1;
    maker.classList.add("case");
    maker.textContent = x + 1;
    maker.style.left = hor + "px";
    maker.style.top = ver + "px";
    maker.addEventListener("click", checkCase);
    con.appendChild(maker);
    if (x % 4 == 3) {
      ver += 130;
      hor = tempCon.left - spacer / 1.2;
    }
  }
}
function checkCase(e) {
  if (inPlay) {
    let message = "";
    console.log(e.target.ind);
    console.log(e.target.val);
    e.target.classList.add("chosen");

    let ind = holdingArray.indexOf(e.target.val);
    let ind2 = vals.indexOf(e.target.val);
    e.target.removeEventListener("click", checkCase);
    if (holdingArray.length == vals.length) {
      sel = holdingArray.splice(ind, 1)[0];
      let tempCaseNext = holdingArray.length - offers[offerMade];
      e.target.classList.add("chosen");
      popUp(
        `<div><h1>Selected #${e.target.ind}</h1><p>Now Select ${tempCaseNext} cases</p></div>`
      );
      boxOpenSound.play();
      boxOpenSound.currentTime = 0;
      myBox.innerHTML = `Your Box: #${e.target.ind}`;
    } else {
      e.target.classList.remove("chosen");
      e.target.classList.add("muted");
      sideVal[ind2].classList.add("muted");
      if (ind != -1) {
        holdingArray.splice(ind, 1);
      }
      let halfWay = vals[Math.floor(vals.length / 2)];
      if (e.target.val <= halfWay) {
        message += "<h1>Well Done</h1>";
      } else {
        message += "<h1>Unlucky</h1>";
      }
      boxOpenSound.play();
      boxOpenSound.currentTime = 0;

      popUp(`${message} <h1>£${e.target.val}</h1>`);
    }
  }
}

function makeOffer() {
  let arr = [];
  for (let i = 0; i < holdingArray.length; i++) {
    if (vals.indexOf[holdingArray[i]] !== -1) {
      arr.push(holdingArray[i]);
    }
  }
  let sumArr = arr.reduce((acc, cur) => acc + cur);
  let halfSumArr = sumArr / arr.length;
  let lowestOffer = halfSumArr * 0.8;
  let highestOffer = halfSumArr * 1.2;
  console.log(`sum array ${sumArr}`);
  console.log(`sum array length ${arr.length}`);

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const rndInt = randomIntFromInterval(lowestOffer, highestOffer);

  console.log(`lowest: ${lowestOffer}`);
  console.log(`highestOffer: ${highestOffer}`);
  if (holdingArray.length >= 2) {
    offer = rndInt.toFixed(2);
    console.log(`not last offer ${offer}`);
  } else {
    offer = (holdingArray[0] + sel) / 2;
    console.log(`2 left offer ${offer}`);
  }
  return offer;
}
