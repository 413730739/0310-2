let radio;
let input;
let submitButton;
let resultText = '';
let table;
let currentQuestionIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let fireworks = []; // 煙火陣列

function preload() {
  // 載入 Excel 檔案
  table = loadTable('questions.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#e7c6ff");// 顏色為"#e7c6ff"
  fill('#390099');
  
  // 建立 radio 物件
  radio = createRadio();
  radio.position(windowWidth / 2 - 50, windowHeight / 2 + 20);
  radio.style('width', '100px');
  radio.style('text-align', 'center');
  radio.style('display', 'block'); // 確保每個選項顯示在新的一行
  radio.style('color', '#390099'); // 設置選項文字顏色

  // 建立填充題輸入框
  input = createInput();
  input.position(windowWidth / 2 - 50, windowHeight / 2 + 20);
  input.style('width', '100px');
  input.hide(); // 初始隱藏

  // 建立送出按鈕
  submitButton = createButton('送出');
  submitButton.position(windowWidth / 2 - 50, windowHeight / 2 + 150); // 調整按鈕位置
  submitButton.style('color', '#390099'); // 設置按鈕文字顏色
  submitButton.mousePressed(checkAnswer);

  // 顯示第一題
  displayQuestion();
}

function draw() {
  background("#e7c6ff");// 顏色為"#e7c6ff"

  // 顯示題目
  textAlign(CENTER);
  textSize(24);
  fill('#390099');
  if (currentQuestionIndex < table.getRowCount()) {
    text(table.getString(currentQuestionIndex, 'question'), windowWidth / 2, windowHeight / 2 - 20);
  }

  // 顯示結果
  textSize(18);
  textAlign(CENTER);
  if (resultText.includes('所有題目已完成')) {
    fill('#390099');
  } else {
    fill(resultText.includes('正確') ? 'green' : 'red');
  }
  text(resultText, windowWidth / 2, windowHeight / 2 + 200); // 調整結果顯示位置

  // 顯示答對和答錯紀錄
  textSize(18);
  fill('#390099');
  text(`答對: ${correctCount} 答錯: ${incorrectCount}`, windowWidth / 2, windowHeight / 2 + 250);

  // 更新並顯示煙火
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
}

function checkAnswer() {
  let selected;
  const correctAnswer = table.getString(currentQuestionIndex, 'answer');
  if (table.getString(currentQuestionIndex, 'type') === 'choice') {
    selected = radio.value();
  } else {
    selected = input.value();
  }

  if (selected === correctAnswer) {
    resultText = '答案正確';
    correctCount++;
    // 新增隨機數量的煙火效果
    const fireworkCount = int(random(5, 11)); // 隨機生成 5 到 10 個煙火
    for (let i = 0; i < fireworkCount; i++) {
      fireworks.push(new Firework(random(width), random(height / 2)));
    }
  } else {
    resultText = '答案錯誤';
    incorrectCount++;
  }

  // 顯示下一題
  currentQuestionIndex++;
  if (currentQuestionIndex < table.getRowCount()) {
    displayQuestion();
  } else {
    resultText = `所有題目已完成~`;
    radio.hide(); // 隱藏選項
    input.hide(); // 隱藏輸入框
    submitButton.hide(); // 隱藏按鈕
  }
}

function displayQuestion() {
  const questionType = table.getString(currentQuestionIndex, 'type');
  if (questionType === 'choice') {
    radio.show();
    input.hide();
    radio.elt.innerHTML = ''; // 清空現有選項

    // 動態設定題目的位置
    const questionY = windowHeight / 2 ; // 題目的垂直位置
    textAlign(CENTER);
    textSize(24);
    fill('#390099');
    text(table.getString(currentQuestionIndex, 'question'), windowWidth / 2, questionY);

    // 設定選項的起始位置
    const optionStartX = windowWidth / 2 - 200; // 選項的水平起始位置
    const optionStartY = questionY + 40; // 選項從題目下方開始
    radio.position(optionStartX, optionStartY);

    // 添加選項
    for (let i = 1; i <= 4; i++) {
      const optionText = table.getString(currentQuestionIndex, `option${i}`);
      radio.option(optionText); // 添加選項
    }

    // 確保選項文字範圍根據文字量自動延伸
    const options = radio.elt.querySelectorAll('label');
    options.forEach(option => {
      option.style.display = 'inline-block'; // 設置選項為行內區塊
      option.style.marginRight = '20px'; // 添加選項之間的水平間距
      option.style.width = 'auto'; // 自動調整寬度
      option.style.whiteSpace = 'nowrap'; // 防止文字換行
    });
  } else {
    radio.hide();
    input.show();
    input.value(''); // 清空輸入框
    input.position(windowWidth / 2 - 50, windowHeight / 2 + 20); // 與題目對齊
  }
}

// 煙火類別
class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.particles = [];
    const particleCount = random(50, 150); // 每個煙火隨機粒子數量
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.x, this.y));
    }
  }

  update() {
    for (let particle of this.particles) {
      particle.update();
    }
  }

  show() {
    for (let particle of this.particles) {
      particle.show();
    }
  }

  done() {
    return this.particles.every(particle => particle.done());
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);//  隨機速度
    this.vy = random(-5, -1);// 隨機速度
    this.alpha = 255;// 透明度
    this.size = random(3, 8); // 粒子大小隨機
    this.color = color(random(255), random(255), random(255)); // 隨機顏色
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
  }

  show() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.alpha); // 使用粒子的顏色
    ellipse(this.x, this.y, this.size); // 使用隨機大小
  }

  done() {
    return this.alpha <= 0;
  }
}
