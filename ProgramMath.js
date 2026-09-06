/*
=========================================================
PROGRAMMATH.JS
Infinite Math Question Generator
K-12 / 12 Units Per Grade / 3 Difficulties

Grades:
K-7  = Elementary / Middle School
8    = Pre-Algebra
9    = Algebra 1
10   = Geometry
11   = Algebra 2 / Trigonometry
12   = Precalculus / Intro Calculus
=========================================================
*/

(function () {
  "use strict";

  // =====================================================
  // RANDOM UTILITIES
  // =====================================================

  function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomChoice(array) {
    return array[randomInt(0, array.length - 1)];
  }

  function shuffle(array) {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
      const j = randomInt(0, i);

      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);

    while (b !== 0) {
      [a, b] = [b, a % b];
    }

    return a;
  }

  function fractionString(numerator, denominator) {
    const divisor = gcd(numerator, denominator);

    numerator /= divisor;
    denominator /= divisor;

    if (denominator < 0) {
      numerator *= -1;
      denominator *= -1;
    }

    if (denominator === 1) {
      return String(numerator);
    }

    return `${numerator}/${denominator}`;
  }

  function decimal(value, places = 2) {
    return Number(value.toFixed(places));
  }

  // =====================================================
  // GRADE LABELS
  // =====================================================

  function gradeLabel(grade) {
    const g = String(grade);

    if (g === "K") return "Kindergarten";

    const number = Number(g);

    if (number === 1) return "1st Grade";
    if (number === 2) return "2nd Grade";
    if (number === 3) return "3rd Grade";

    return `${number}th Grade`;
  }

  // =====================================================
  // QUESTION CREATOR
  // =====================================================

  function createQuestion({
    grade,
    unit,
    difficulty,
    type = "multiple-choice",
    prompt,
    choices,
    answer,
    explanation,
  }) {
    let finalChoices = choices ? [...choices] : null;

    if (finalChoices && !finalChoices.includes(answer)) {
      finalChoices[0] = answer;
    }

    if (finalChoices) {
      finalChoices = shuffle(finalChoices);
    }

    return {
      id: `PM-${grade}-${unit}-${Date.now()}-${randomInt(1000, 9999)}`,

      grade: String(grade),
      gradeLabel: gradeLabel(grade),

      unit: Number(unit),

      difficulty,

      type,

      prompt,

      choices: finalChoices,

      answer,

      explanation,

      unitTitle: curriculum[grade][unit - 1],

      standards: [],
    };
  }

  // =====================================================
  // CURRICULUM
  // =====================================================

  const curriculum = {
    K: [
      "Counting & Numbers",
      "Addition",
      "Subtraction",
      "Shapes",
      "Patterns",
      "Measurement",
      "Comparing Numbers",
      "Place Value",
      "Time",
      "Money",
      "Data",
      "Early Algebra",
    ],

    1: [
      "Addition & Subtraction",
      "Place Value",
      "Counting",
      "Shapes",
      "Measurement",
      "Time",
      "Money",
      "Data",
      "Patterns",
      "Fractions",
      "Word Problems",
      "Early Algebra",
    ],

    2: [
      "Addition",
      "Subtraction",
      "Multiplication",
      "Division",
      "Place Value",
      "Money",
      "Time",
      "Measurement",
      "Shapes",
      "Fractions",
      "Data",
      "Word Problems",
    ],

    3: [
      "Multiplication",
      "Division",
      "Fractions",
      "Decimals",
      "Area",
      "Perimeter",
      "Geometry",
      "Measurement",
      "Time",
      "Data",
      "Word Problems",
    ],

    4: [
      "Multi-Digit Operations",
      "Factors & Multiples",
      "Fractions",
      "Decimals",
      "Angles",
      "Geometry",
      "Area",
      "Perimeter",
      "Measurement",
      "Data",
      "Patterns",
      "Word Problems",
    ],

    5: [
      "Fractions",
      "Decimals",
      "Multi-Digit Operations",
      "Expressions",
      "Volume",
      "Coordinate Plane",
      "Geometry",
      "Measurement",
      "Data",
      "Patterns",
      "Ratios",
      "Word Problems",
    ],

    6: [
      "Ratios",
      "Rates",
      "Fractions",
      "Decimals",
      "Percentages",
      "Expressions",
      "Equations",
      "Integers",
      "Geometry",
      "Area & Volume",
      "Statistics",
      "Probability",
    ],

    7: [
      "Ratios & Proportions",
      "Percentages",
      "Expressions",
      "Equations",
      "Inequalities",
      "Integers",
      "Rational Numbers",
      "Geometry",
      "Probability",
      "Statistics",
      "Scale",
      "Word Problems",
    ],

    8: [
      "Pre-Algebra & Number Systems",
      "Expressions",
      "Linear Equations",
      "Functions",
      "Systems of Equations",
      "Exponents",
      "Scientific Notation",
      "Pythagorean Theorem",
      "Transformations",
      "Statistics",
      "Slope",
      "Word Problems",
    ],

    9: [
      "Linear Equations",
      "Functions",
      "Systems of Equations",
      "Inequalities",
      "Exponents",
      "Polynomials",
      "Factoring",
      "Quadratics",
      "Coordinate Geometry",
      "Statistics",
      "Sequences",
      "Algebraic Modeling",
    ],

    10: [
      "Geometric Foundations",
      "Angles & Lines",
      "Triangles",
      "Similarity",
      "Congruence",
      "Quadrilaterals",
      "Circles",
      "Area & Perimeter",
      "Surface Area",
      "Volume",
      "Coordinate Geometry",
      "Trigonometry",
    ],

    11: [
      "Advanced Algebra",
      "Quadratics",
      "Polynomial Functions",
      "Rational Functions",
      "Radicals",
      "Complex Numbers",
      "Exponential Functions",
      "Logarithms",
      "Sequences & Series",
      "Trigonometry",
      "Probability & Statistics",
      "Algebraic Modeling",
    ],

    12: [
      "Functions",
      "Advanced Functions",
      "Trigonometry",
      "Exponential Functions",
      "Logarithms",
      "Sequences",
      "Probability",
      "Statistics",
      "Limits",
      "Derivatives",
      "Integrals",
      "Calculus Applications",
    ],
  };

  // =====================================================
  // QUESTION GENERATORS
  // =====================================================

  const generators = {};

  // =====================================================
  // KINDERGARTEN
  // =====================================================

  generators.K_counting = function (grade, unit, difficulty) {
    const max = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30;

    const answer = randomInt(1, max);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What number comes after ${answer - 1}?`,
      choices: [
        String(answer),
        String(answer + 1),
        String(answer - 2),
        String(answer + 2),
      ],
      answer: String(answer),
      explanation: `Counting forward by one, the number after ${
        answer - 1
      } is ${answer}.`,
    });
  };

  generators.K_addition = function (grade, unit, difficulty) {
    const max = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 20;

    const a = randomInt(0, max);
    const b = randomInt(0, max);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is ${a} + ${b}?`,
      choices: [
        String(a + b),
        String(a + b + 1),
        String(Math.max(0, a + b - 1)),
        String(a + b + 2),
      ],
      answer: String(a + b),
      explanation: `${a} + ${b} = ${a + b}.`,
    });
  };

  generators.K_subtraction = function (grade, unit, difficulty) {
    const max = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15;

    const a = randomInt(1, max);
    const b = randomInt(0, a);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is ${a} - ${b}?`,
      choices: [
        String(a - b),
        String(a - b + 1),
        String(Math.max(0, a - b - 1)),
        String(a + b),
      ],
      answer: String(a - b),
      explanation: `${a} - ${b} = ${a - b}.`,
    });
  };

  generators.K_shapes = function (grade, unit, difficulty) {
    const shapes = [
      ["triangle", "3"],
      ["square", "4"],
      ["rectangle", "4"],
      ["pentagon", "5"],
      ["hexagon", "6"],
    ];

    const [shape, sides] = randomChoice(shapes);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `How many sides does a ${shape} have?`,
      choices: [sides, "2", "5", "8"],
      answer: sides,
      explanation: `A ${shape} has ${sides} sides.`,
    });
  };

  generators.K_patterns = function (grade, unit, difficulty) {
    const start = randomInt(1, 8);
    const step = randomChoice([1, 2, 3]);

    const answer = start + step * 3;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What comes next? ${start}, ${start + step}, ${
        start + step * 2
      }, ?`,
      choices: [
        String(answer),
        String(answer + 1),
        String(answer - 1),
        String(answer + 2),
      ],
      answer: String(answer),
      explanation: `The pattern adds ${step} each time.`,
    });
  };

  generators.K_measurement = function (grade, unit, difficulty) {
    const items = [
      ["Which is longer?", "A pencil", "A school bus", "A school bus"],
      ["Which is heavier?", "A feather", "A rock", "A rock"],
      ["Which holds more?", "A cup", "A bathtub", "A bathtub"],
    ];

    const item = randomChoice(items);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: item[0],
      choices: [item[1], item[2], "They are always the same", "Cannot tell"],
      answer: item[3],
      explanation: `${item[3]} is the better measurement comparison.`,
    });
  };

  generators.K_comparing = function (grade, unit, difficulty) {
    const a = randomInt(1, 10);
    const b = randomInt(1, 10);

    const symbol = a > b ? ">" : a < b ? "<" : "=";

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Which symbol makes this true? ${a} ? ${b}`,
      choices: [">", "<", "=", "+"],
      answer: symbol,
      explanation: `${a} ${symbol} ${b} is true.`,
    });
  };

  generators.K_placeValue = function (grade, unit, difficulty) {
    const tens = randomInt(1, 5);
    const ones = randomInt(0, 9);

    const answer = tens;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `In the number ${tens}${ones}, what is the tens digit?`,
      choices: [String(answer), String(ones), "0", String(answer + 1)],
      answer: String(answer),
      explanation: `The tens digit in ${tens}${ones} is ${tens}.`,
    });
  };

  generators.K_time = function (grade, unit, difficulty) {
    const hours = randomInt(1, 12);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `If the clock shows exactly ${hours}:00, what time is it?`,
      choices: [
        `${hours}:00`,
        `${hours}:30`,
        `${(hours % 12) + 1}:00`,
        `${Math.max(1, hours - 1)}:00`,
      ],
      answer: `${hours}:00`,
      explanation: `The hour is ${hours} and there are zero minutes.`,
    });
  };

  generators.K_money = function (grade, unit, difficulty) {
    const cents = randomChoice([1, 5, 10, 25]);

    const names = {
      1: "penny",
      5: "nickel",
      10: "dime",
      25: "quarter",
    };

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `How many cents is a ${names[cents]} worth?`,
      choices: [String(cents), "5", "10", "25"],
      answer: String(cents),
      explanation: `A ${names[cents]} is worth ${cents} cent${
        cents === 1 ? "" : "s"
      }.`,
    });
  };

  generators.K_data = function (grade, unit, difficulty) {
    const cats = randomInt(1, 6);
    const dogs = randomInt(1, 6);

    const answer =
      cats > dogs ? "Cats" : cats < dogs ? "Dogs" : "They are equal";

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `A chart shows ${cats} cats and ${dogs} dogs. Which group has more?`,
      choices: ["Cats", "Dogs", "They are equal", "Neither"],
      answer,
      explanation: `${cats} and ${dogs} can be compared directly.`,
    });
  };

  generators.K_algebra = function (grade, unit, difficulty) {
    const x = randomInt(1, 10);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Which number makes this true? □ + 2 = ${x + 2}`,
      choices: [String(x), String(x + 1), String(x - 1), String(x + 2)],
      answer: String(x),
      explanation: `${x} + 2 = ${x + 2}.`,
    });
  };

  // =====================================================
  // GRADE 1
  // =====================================================

  generators.G1_addition = function (grade, unit, difficulty) {
    const max = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 50;

    const a = randomInt(1, max);
    const b = randomInt(1, max);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is ${a} + ${b}?`,
      choices: [
        String(a + b),
        String(a + b + 5),
        String(Math.max(0, a + b - 5)),
        String(a + b + 10),
      ],
      answer: String(a + b),
      explanation: `${a} + ${b} = ${a + b}.`,
    });
  };

  generators.G1_subtraction = function (grade, unit, difficulty) {
    const max = difficulty === "easy" ? 10 : difficulty === "medium" ? 30 : 50;

    const a = randomInt(5, max);
    const b = randomInt(0, a);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is ${a} - ${b}?`,
      choices: [
        String(a - b),
        String(a - b + 2),
        String(Math.max(0, a - b - 2)),
        String(a + b),
      ],
      answer: String(a - b),
      explanation: `${a} - ${b} = ${a - b}.`,
    });
  };

  generators.G1_placeValue = function (grade, unit, difficulty) {
    const number = randomInt(10, difficulty === "hard" ? 999 : 99);
    const tens = Math.floor(number / 10) % 10;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is the tens digit in ${number}?`,
      choices: [
        String(tens),
        String(number % 10),
        String(Math.floor(number / 100)),
        "0",
      ],
      answer: String(tens),
      explanation: `The tens digit is the second digit from the right.`,
    });
  };

  generators.G1_counting = function (grade, unit, difficulty) {
    const start = randomInt(1, difficulty === "easy" ? 20 : 50);
    const answer = start + 2;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Count by 1s: ${start}, ${
        start + 1
      }, ${answer}. What comes next?`,
      choices: [
        String(answer + 1),
        String(answer + 2),
        String(answer - 1),
        String(answer + 5),
      ],
      answer: String(answer + 1),
      explanation: `The numbers increase by 1.`,
    });
  };

  generators.G1_shapes = generators.K_shapes;

  generators.G1_measurement = function (grade, unit, difficulty) {
    const lengths = [3, 5, 7, 9];
    const a = randomChoice(lengths);
    const b = randomChoice(lengths.filter((x) => x !== a));

    const answer = a > b ? `${a} inches` : `${b} inches`;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `A pencil is ${a} inches long and a crayon is ${b} inches long. Which is longer?`,
      choices: [
        `The ${a}-inch pencil`,
        `The ${b}-inch crayon`,
        "They are equal",
        "Not enough information",
      ],
      answer,
      explanation: `The longer measurement is ${Math.max(a, b)} inches.`,
    });
  };

  generators.G1_time = function (grade, unit, difficulty) {
    const hour = randomInt(1, 12);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What time is it when the minute hand is on 12 and the hour hand is on ${hour}?`,
      choices: [
        `${hour}:00`,
        `${hour}:30`,
        `${(hour % 12) + 1}:00`,
        `${hour}:15`,
      ],
      answer: `${hour}:00`,
      explanation: `The minute hand on 12 means :00.`,
    });
  };

  generators.G1_money = function (grade, unit, difficulty) {
    const a = randomInt(1, 5);
    const b = randomInt(1, 5);

    const answer = a + b;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `You have ${a} pennies and get ${b} more pennies. How many pennies do you have?`,
      choices: [
        String(answer),
        String(answer + 1),
        String(Math.max(0, answer - 1)),
        String(answer + 5),
      ],
      answer: String(answer),
      explanation: `${a} + ${b} = ${answer} pennies.`,
    });
  };

  generators.G1_data = function (grade, unit, difficulty) {
    const apples = randomInt(1, 10);
    const oranges = randomInt(1, 10);

    const answer =
      apples > oranges
        ? "Apples"
        : apples < oranges
        ? "Oranges"
        : "They are equal";

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `A chart has ${apples} apples and ${oranges} oranges. Which has more?`,
      choices: ["Apples", "Oranges", "They are equal", "Neither"],
      answer,
      explanation: `Compare ${apples} and ${oranges}.`,
    });
  };

  generators.G1_patterns = generators.K_patterns;

  generators.G1_fractions = function (grade, unit, difficulty) {
    const denominator = randomChoice([2, 3, 4]);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Which fraction means one half?`,
      choices: ["1/2", "1/3", "1/4", "2/3"],
      answer: "1/2",
      explanation: `One half is written as 1/2.`,
    });
  };

  generators.G1_wordProblems = generators.G1_addition;

  generators.G1_algebra = function (grade, unit, difficulty) {
    const x = randomInt(1, 20);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What number makes this true? □ + 5 = ${x + 5}`,
      choices: [String(x), String(x + 5), String(x - 5), String(x + 1)],
      answer: String(x),
      explanation: `${x} + 5 = ${x + 5}.`,
    });
  };

  // =====================================================
  // GRADES 2–3 BASIC OPERATIONS
  // =====================================================

  function basicAdditionGenerator(maxEasy, maxMedium, maxHard) {
    return function (grade, unit, difficulty) {
      const max =
        difficulty === "easy"
          ? maxEasy
          : difficulty === "medium"
          ? maxMedium
          : maxHard;

      const a = randomInt(1, max);
      const b = randomInt(1, max);
      const answer = a + b;

      return createQuestion({
        grade,
        unit,
        difficulty,
        prompt: `What is ${a} + ${b}?`,
        choices: [
          String(answer),
          String(answer + 10),
          String(Math.max(0, answer - 10)),
          String(answer + 5),
        ],
        answer: String(answer),
        explanation: `${a} + ${b} = ${answer}.`,
      });
    };
  }

  function basicSubtractionGenerator(max) {
    return function (grade, unit, difficulty) {
      const a = randomInt(10, max);
      const b = randomInt(1, a);
      const answer = a - b;

      return createQuestion({
        grade,
        unit,
        difficulty,
        prompt: `What is ${a} - ${b}?`,
        choices: [
          String(answer),
          String(answer + 10),
          String(Math.max(0, answer - 10)),
          String(a + b),
        ],
        answer: String(answer),
        explanation: `${a} - ${b} = ${answer}.`,
      });
    };
  }

  function multiplicationGenerator(max) {
    return function (grade, unit, difficulty) {
      const a = randomInt(1, max);
      const b = randomInt(1, max);
      const answer = a * b;

      return createQuestion({
        grade,
        unit,
        difficulty,
        prompt: `What is ${a} × ${b}?`,
        choices: [
          String(answer),
          String(answer + a),
          String(answer - a),
          String(a + b),
        ],
        answer: String(answer),
        explanation: `${a} × ${b} = ${answer}.`,
      });
    };
  }

  function divisionGenerator(max) {
    return function (grade, unit, difficulty) {
      const divisor = randomInt(2, max);
      const answer = randomInt(1, max);
      const dividend = divisor * answer;

      return createQuestion({
        grade,
        unit,
        difficulty,
        prompt: `What is ${dividend} ÷ ${divisor}?`,
        choices: [
          String(answer),
          String(answer + divisor),
          String(Math.max(1, answer - 1)),
          String(dividend),
        ],
        answer: String(answer),
        explanation: `${dividend} ÷ ${divisor} = ${answer}.`,
      });
    };
  }

  // =====================================================
  // GRADE 2
  // =====================================================

  generators.G2_addition = basicAdditionGenerator(20, 50, 100);
  generators.G2_subtraction = basicSubtractionGenerator(100);
  generators.G2_multiplication = multiplicationGenerator(5);
  generators.G2_division = divisionGenerator(5);

  generators.G2_placeValue = function (grade, unit, difficulty) {
    const number = randomInt(100, difficulty === "hard" ? 9999 : 999);
    const hundreds = Math.floor(number / 100) % 10;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is the hundreds digit in ${number}?`,
      choices: [
        String(hundreds),
        String(number % 10),
        String(Math.floor(number / 10) % 10),
        "0",
      ],
      answer: String(hundreds),
      explanation: `The hundreds digit is the third digit from the right.`,
    });
  };

  generators.G2_money = function (grade, unit, difficulty) {
    const dollars = randomInt(1, 10);
    const coins = randomInt(1, 5);

    const answer = dollars + coins * 0.25;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `You have $${dollars}.00 and ${coins} quarters. How much money do you have?`,
      choices: [
        `$${answer.toFixed(2)}`,
        `$${(answer + 1).toFixed(2)}`,
        `$${Math.max(0, answer - 1).toFixed(2)}`,
        `$${(answer + 0.25).toFixed(2)}`,
      ],
      answer: `$${answer.toFixed(2)}`,
      explanation: `${coins} quarters are worth $${(coins * 0.25).toFixed(2)}.`,
    });
  };

  generators.G2_time = generators.G1_time;

  generators.G2_measurement = function (grade, unit, difficulty) {
    const a = randomInt(2, 12);
    const b = randomInt(2, 12);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `A ribbon is ${a} inches long. Another ribbon is ${b} inches long. How much longer is the longer ribbon?`,
      choices: [
        `${Math.abs(a - b)} inches`,
        `${a + b} inches`,
        `${Math.max(a, b)} inches`,
        `${Math.min(a, b)} inches`,
      ],
      answer: `${Math.abs(a - b)} inches`,
      explanation: `Subtract the shorter length from the longer length.`,
    });
  };

  generators.G2_shapes = function (grade, unit, difficulty) {
    const shapes = [
      ["triangle", 3],
      ["square", 4],
      ["rectangle", 4],
      ["pentagon", 5],
      ["hexagon", 6],
      ["octagon", 8],
    ];

    const [shape, sides] = randomChoice(shapes);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `How many sides does a ${shape} have?`,
      choices: [String(sides), "3", "4", "6"],
      answer: String(sides),
      explanation: `A ${shape} has ${sides} sides.`,
    });
  };

  generators.G2_fractions = function (grade, unit, difficulty) {
    const denominator = randomChoice([2, 3, 4, 5]);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Which fraction represents one whole divided into ${denominator} equal parts with one part shaded?`,
      choices: [
        `1/${denominator}`,
        `2/${denominator}`,
        `1/${denominator + 1}`,
        `${denominator}/1`,
      ],
      answer: `1/${denominator}`,
      explanation: `One of ${denominator} equal parts is ${`1/${denominator}`}.`,
    });
  };

  generators.G2_data = generators.G1_data;
  generators.G2_wordProblems = generators.G2_addition;

  // =====================================================
  // GRADE 3
  // =====================================================

  generators.G3_multiplication = multiplicationGenerator(12);
  generators.G3_division = divisionGenerator(12);

  generators.G3_fractions = function (grade, unit, difficulty) {
    const denominator = randomChoice([2, 3, 4, 5, 6, 8]);
    const numerator = randomInt(1, denominator - 1);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is ${numerator}/${denominator} + ${numerator}/${denominator}?`,
      choices: [
        fractionString(numerator * 2, denominator),
        fractionString(numerator, denominator),
        fractionString(numerator * 3, denominator),
        fractionString(1, denominator),
      ],
      answer: fractionString(numerator * 2, denominator),
      explanation: `Add the numerators: ${numerator} + ${numerator} = ${
        numerator * 2
      }.`,
    });
  };

  generators.G3_decimals = function (grade, unit, difficulty) {
    const a = decimal(randomInt(1, 99) / 10, 1);
    const b = decimal(randomInt(1, 99) / 10, 1);
    const answer = decimal(a + b, 1);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is ${a} + ${b}?`,
      choices: [
        String(answer),
        String(decimal(answer + 1, 1)),
        String(decimal(answer - 1, 1)),
        String(decimal(answer + 0.5, 1)),
      ],
      answer: String(answer),
      explanation: `${a} + ${b} = ${answer}.`,
    });
  };

  generators.G3_area = function (grade, unit, difficulty) {
    const width = randomInt(2, 12);
    const height = randomInt(2, 12);
    const answer = width * height;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `A rectangle is ${width} units long and ${height} units wide. What is its area?`,
      choices: [
        `${answer} square units`,
        `${width + height} square units`,
        `${answer + width} square units`,
        `${answer - width} square units`,
      ],
      answer: `${answer} square units`,
      explanation: `Area = length × width = ${width} × ${height} = ${answer}.`,
    });
  };

  generators.G3_perimeter = function (grade, unit, difficulty) {
    const length = randomInt(2, 12);
    const width = randomInt(2, 10);
    const answer = 2 * (length + width);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is the perimeter of a rectangle with length ${length} and width ${width}?`,
      choices: [
        `${answer} units`,
        `${length * width} units`,
        `${answer + 2} units`,
        `${answer - 2} units`,
      ],
      answer: `${answer} units`,
      explanation: `Perimeter = 2(length + width) = ${answer}.`,
    });
  };

  generators.G3_geometry = generators.G2_shapes;

  generators.G3_measurement = generators.G2_measurement;
  generators.G3_time = generators.G1_time;
  generators.G3_data = generators.G1_data;
  generators.G3_wordProblems = generators.G3_area;

  generators.G3_patterns = function (grade, unit, difficulty) {
    const step = randomChoice([2, 3, 5, 10]);
    const start = randomInt(1, 20);
    const answer = start + step * 4;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What comes next? ${start}, ${start + step}, ${
        start + step * 2
      }, ${start + step * 3}, ?`,
      choices: [
        String(answer),
        String(answer + step),
        String(answer - step),
        String(answer + 1),
      ],
      answer: String(answer),
      explanation: `The pattern increases by ${step}.`,
    });
  };

  // =====================================================
  // GRADE 4
  // =====================================================

  generators.G4_multiDigit = function (grade, unit, difficulty) {
    const a = randomInt(1000, 9999);
    const b = randomInt(100, 999);
    const answer = a + b;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is ${a.toLocaleString()} + ${b.toLocaleString()}?`,
      choices: [
        answer.toLocaleString(),
        (answer + 100).toLocaleString(),
        (answer - 100).toLocaleString(),
        (answer + 1000).toLocaleString(),
      ],
      answer: answer.toLocaleString(),
      explanation: `${a.toLocaleString()} + ${b.toLocaleString()} = ${answer.toLocaleString()}.`,
    });
  };

  generators.G4_factors = function (grade, unit, difficulty) {
    const factorPairs = [
      [2, 12, 24],
      [3, 8, 24],
      [4, 6, 24],
      [5, 6, 30],
    ];

    const [a, b, product] = randomChoice(factorPairs);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Which pair is a factor pair of ${product}?`,
      choices: [
        `${a} and ${b}`,
        `${a + 1} and ${b}`,
        `${a} and ${b + 1}`,
        `${a + 2} and ${b + 2}`,
      ],
      answer: `${a} and ${b}`,
      explanation: `${a} × ${b} = ${product}.`,
    });
  };

  generators.G4_fractions = function (grade, unit, difficulty) {
    const denominator = randomChoice([2, 4, 5, 8, 10]);
    const a = randomInt(1, denominator - 1);
    const b = randomInt(1, denominator - 1);

    const numerator = a + b;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is ${a}/${denominator} + ${b}/${denominator}?`,
      choices: [
        fractionString(numerator, denominator),
        fractionString(a + b + 1, denominator),
        fractionString(Math.max(1, numerator - 1), denominator),
        fractionString(numerator, denominator * 2),
      ],
      answer: fractionString(numerator, denominator),
      explanation: `Add the numerators because the denominators are the same.`,
    });
  };

  generators.G4_decimals = generators.G3_decimals;

  generators.G4_angles = function (grade, unit, difficulty) {
    const angles = [
      ["acute", 45],
      ["right", 90],
      ["obtuse", 120],
    ];

    const [type, degrees] = randomChoice(angles);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What type of angle measures ${degrees}°?`,
      choices: ["Acute", "Right", "Obtuse", "Straight"],
      answer: type.charAt(0).toUpperCase() + type.slice(1),
      explanation: `${degrees}° is a ${type} angle.`,
    });
  };

  generators.G4_geometry = function (grade, unit, difficulty) {
    return generators.G2_shapes(grade, unit, difficulty);
  };

  generators.G4_area = generators.G3_area;
  generators.G4_perimeter = generators.G3_perimeter;
  generators.G4_measurement = generators.G2_measurement;
  generators.G4_data = generators.G1_data;
  generators.G4_patterns = generators.G3_patterns;
  generators.G4_wordProblems = generators.G4_multiDigit;

  // =====================================================
  // GRADE 5
  // =====================================================

  generators.G5_fractions = function (grade, unit, difficulty) {
    const denominator = randomChoice([2, 3, 4, 5, 6, 8]);
    const a = randomInt(1, denominator - 1);
    const b = randomInt(1, denominator - 1);

    const numerator = a + b;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is ${a}/${denominator} + ${b}/${denominator}?`,
      choices: [
        fractionString(numerator, denominator),
        fractionString(numerator + 1, denominator),
        fractionString(Math.max(1, numerator - 1), denominator),
        fractionString(numerator, denominator * 2),
      ],
      answer: fractionString(numerator, denominator),
      explanation: `Add the numerators: ${a} + ${b} = ${numerator}.`,
    });
  };

  generators.G5_decimals = generators.G3_decimals;
  generators.G5_multiDigit = generators.G4_multiDigit;

  generators.G5_expressions = function (grade, unit, difficulty) {
    const x = randomInt(1, 10);
    const a = randomInt(2, 8);
    const b = randomInt(1, 10);
    const answer = a * x + b;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Evaluate ${a}x + ${b} when x = ${x}.`,
      choices: [
        String(answer),
        String(answer + a),
        String(answer - a),
        String(a * (x + b)),
      ],
      answer: String(answer),
      explanation: `Substitute x = ${x}: ${a}(${x}) + ${b} = ${answer}.`,
    });
  };

  generators.G5_volume = function (grade, unit, difficulty) {
    const l = randomInt(2, 10);
    const w = randomInt(2, 10);
    const h = randomInt(2, 10);
    const answer = l * w * h;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is the volume of a rectangular prism with dimensions ${l}, ${w}, and ${h}?`,
      choices: [
        `${answer} cubic units`,
        `${l * w} cubic units`,
        `${answer + h} cubic units`,
        `${answer - h} cubic units`,
      ],
      answer: `${answer} cubic units`,
      explanation: `Volume = length × width × height = ${answer}.`,
    });
  };

  generators.G5_coordinate = function (grade, unit, difficulty) {
    const x = randomInt(-5, 5);
    const y = randomInt(-5, 5);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Which ordered pair represents the point with x = ${x} and y = ${y}?`,
      choices: [
        `(${x}, ${y})`,
        `(${y}, ${x})`,
        `(${-x}, ${y})`,
        `(${x}, ${-y})`,
      ],
      answer: `(${x}, ${y})`,
      explanation: `An ordered pair is written (x, y).`,
    });
  };

  generators.G5_geometry = generators.G2_shapes;
  generators.G5_measurement = generators.G2_measurement;
  generators.G5_data = generators.G1_data;
  generators.G5_patterns = generators.G3_patterns;

  generators.G5_ratios = function (grade, unit, difficulty) {
    const a = randomInt(1, 5);
    const b = randomInt(1, 5);
    const multiplier = randomInt(2, 5);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `A ratio is ${a}:${b}. What is an equivalent ratio when both parts are multiplied by ${multiplier}?`,
      choices: [
        `${a * multiplier}:${b * multiplier}`,
        `${a + multiplier}:${b + multiplier}`,
        `${a}:${b * multiplier}`,
        `${a * multiplier}:${b}`,
      ],
      answer: `${a * multiplier}:${b * multiplier}`,
      explanation: `Multiply both parts of the ratio by ${multiplier}.`,
    });
  };

  generators.G5_wordProblems = generators.G5_expressions;

  // =====================================================
  // GRADE 6
  // =====================================================

  generators.G6_ratios = generators.G5_ratios;

  generators.G6_rates = function (grade, unit, difficulty) {
    const miles = randomInt(20, 100);
    const hours = randomInt(2, 5);
    const rate = Math.floor(miles / hours);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `A car travels ${
        rate * hours
      } miles in ${hours} hours. What is its unit rate?`,
      choices: [
        `${rate} miles per hour`,
        `${rate + 5} miles per hour`,
        `${rate - 5} miles per hour`,
        `${rate * hours} miles per hour`,
      ],
      answer: `${rate} miles per hour`,
      explanation: `Divide distance by time.`,
    });
  };

  generators.G6_fractions = generators.G5_fractions;
  generators.G6_decimals = generators.G3_decimals;

  generators.G6_percentages = function (grade, unit, difficulty) {
    const percentage = randomChoice([10, 20, 25, 50]);
    const number = randomChoice([40, 60, 80, 100, 200]);
    const answer = (percentage / 100) * number;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is ${percentage}% of ${number}?`,
      choices: [
        String(answer),
        String(answer + 10),
        String(Math.max(0, answer - 10)),
        String(answer + 20),
      ],
      answer: String(answer),
      explanation: `${percentage}% of ${number} = ${answer}.`,
    });
  };

  generators.G6_expressions = generators.G5_expressions;

  generators.G6_equations = function (grade, unit, difficulty) {
    const x = randomInt(1, 20);
    const a = randomInt(2, 8);
    const b = randomInt(1, 10);
    const total = a * x + b;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Solve for x: ${a}x + ${b} = ${total}.`,
      choices: [
        String(x),
        String(x + 1),
        String(Math.max(0, x - 1)),
        String(x + 2),
      ],
      answer: String(x),
      explanation: `Subtract ${b}, then divide by ${a}.`,
    });
  };

  generators.G6_integers = function (grade, unit, difficulty) {
    const a = randomInt(-20, 20);
    const b = randomInt(-20, 20);
    const answer = a + b;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is ${a} + ${b}?`,
      choices: [
        String(answer),
        String(answer + 5),
        String(answer - 5),
        String(a - b),
      ],
      answer: String(answer),
      explanation: `Adding signed numbers gives ${answer}.`,
    });
  };

  generators.G6_geometry = generators.G4_angles;

  generators.G6_areaVolume = generators.G5_volume;

  generators.G6_statistics = function (grade, unit, difficulty) {
    const values = [
      randomInt(1, 10),
      randomInt(1, 10),
      randomInt(1, 10),
      randomInt(1, 10),
    ];

    const mean = values.reduce((a, b) => a + b, 0) / values.length;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is the mean of ${values.join(", ")}?`,
      choices: [
        String(mean),
        String(mean + 1),
        String(Math.max(0, mean - 1)),
        String(mean + 2),
      ],
      answer: String(mean),
      explanation: `Add all values and divide by ${values.length}.`,
    });
  };

  generators.G6_probability = function (grade, unit, difficulty) {
    const favorable = randomInt(1, 4);
    const total = 4;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `If ${favorable} out of ${total} equally likely outcomes are favorable, what is the probability?`,
      choices: [
        fractionString(favorable, total),
        fractionString(total, favorable),
        fractionString(favorable + 1, total),
        fractionString(favorable, total + 1),
      ],
      answer: fractionString(favorable, total),
      explanation: `Probability = favorable outcomes ÷ total outcomes.`,
    });
  };

  // =====================================================
  // GRADE 7
  // =====================================================

  generators.G7_ratios = function (grade, unit, difficulty) {
    const a = randomInt(2, 10);
    const b = randomInt(2, 10);
    const multiplier = randomInt(2, 5);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Which ratio is equivalent to ${a}:${b}?`,
      choices: [
        `${a * multiplier}:${b * multiplier}`,
        `${a + multiplier}:${b}`,
        `${a}:${b + multiplier}`,
        `${a * multiplier}:${b}`,
      ],
      answer: `${a * multiplier}:${b * multiplier}`,
      explanation: `Multiply both parts of the ratio by the same number.`,
    });
  };

  generators.G7_percentages = generators.G6_percentages;
  generators.G7_expressions = generators.G5_expressions;
  generators.G7_equations = generators.G6_equations;

  generators.G7_inequalities = function (grade, unit, difficulty) {
    const x = randomInt(1, 20);
    const amount = x + randomInt(1, 5);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Which value makes x < ${amount} true?`,
      choices: [
        String(x),
        String(amount + 2),
        String(amount),
        String(amount + 5),
      ],
      answer: String(x),
      explanation: `${x} is less than ${amount}.`,
    });
  };

  generators.G7_integers = generators.G6_integers;
  generators.G7_rational = generators.G6_fractions;
  generators.G7_geometry = generators.G4_angles;
  generators.G7_probability = generators.G6_probability;
  generators.G7_statistics = generators.G6_statistics;

  generators.G7_scale = function (grade, unit, difficulty) {
    const scale = randomChoice([2, 3, 4, 5]);
    const original = randomInt(2, 10);
    const answer = original * scale;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `A drawing uses a scale factor of ${scale}. If the original length is ${original} units, what is the scaled length?`,
      choices: [
        `${answer} units`,
        `${answer + scale} units`,
        `${answer - scale} units`,
        `${original + scale} units`,
      ],
      answer: `${answer} units`,
      explanation: `Multiply ${original} by ${scale}.`,
    });
  };

  generators.G7_wordProblems = generators.G7_ratios;

  // =====================================================
  // GRADE 8 — PRE-ALGEBRA
  // =====================================================

  generators.G8_numberSystems = function (grade, unit, difficulty) {
    const choices = ["√2", "0.5", "3/4", "2"];

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: "Which number is irrational?",
      choices,
      answer: "√2",
      explanation: "√2 cannot be written as a ratio of two integers.",
    });
  };

  generators.G8_expressions = generators.G5_expressions;
  generators.G8_linearEquations = generators.G6_equations;

  generators.G8_functions = function (grade, unit, difficulty) {
    const x = randomInt(1, 10);
    const m = randomInt(2, 6);
    const b = randomInt(1, 10);
    const answer = m * x + b;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `If f(x) = ${m}x + ${b}, what is f(${x})?`,
      choices: [
        String(answer),
        String(answer + m),
        String(answer - m),
        String(m * (x + b)),
      ],
      answer: String(answer),
      explanation: `Substitute ${x}: ${m}(${x}) + ${b} = ${answer}.`,
    });
  };

  generators.G8_systems = function (grade, unit, difficulty) {
    const x = randomInt(1, 10);
    const y = randomInt(1, 10);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `If x + y = ${x + y} and x = ${x}, what is y?`,
      choices: [
        String(y),
        String(y + 1),
        String(Math.max(0, y - 1)),
        String(x + y),
      ],
      answer: String(y),
      explanation: `Substitute x = ${x}: ${x} + y = ${x + y}, so y = ${y}.`,
    });
  };

  generators.G8_exponents = function (grade, unit, difficulty) {
    const base = randomInt(2, 5);
    const exponent = randomInt(2, 4);
    const answer = Math.pow(base, exponent);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is ${base}^${exponent}?`,
      choices: [
        String(answer),
        String(answer + base),
        String(answer - base),
        String(base * exponent),
      ],
      answer: String(answer),
      explanation: `${base} is multiplied by itself ${exponent} times.`,
    });
  };

  generators.G8_scientific = function (grade, unit, difficulty) {
    const exponent = randomInt(2, 6);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Which is ${randomInt(
        1,
        9
      )} × 10^${exponent} written as an ordinary number?`,
      choices: [
        `${randomInt(1, 9)}${"0".repeat(exponent)}`,
        `0.${"0".repeat(exponent - 1)}1`,
        `${randomInt(1, 9)}${"0".repeat(exponent - 1)}`,
        `${randomInt(1, 9)}.${"0".repeat(exponent)}`,
      ],
      answer: "",
      explanation: "Move the decimal point to the right by the exponent.",
    });
  };

  // Correct scientific notation generator
  generators.G8_scientific = function (grade, unit, difficulty) {
    const coefficient = randomInt(1, 9);
    const exponent = randomInt(2, 6);
    const answer = coefficient * Math.pow(10, exponent);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is ${coefficient} × 10^${exponent} written as an ordinary number?`,
      choices: [
        String(answer),
        String(answer * 10),
        String(answer / 10),
        String(coefficient * Math.pow(10, exponent - 1)),
      ],
      answer: String(answer),
      explanation: `Move the decimal point ${exponent} places to the right.`,
    });
  };

  generators.G8_pythagorean = function (grade, unit, difficulty) {
    const triples = [
      [3, 4, 5],
      [6, 8, 10],
      [5, 12, 13],
      [8, 15, 17],
    ];

    const [a, b, c] = randomChoice(triples);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `A right triangle has legs ${a} and ${b}. What is the hypotenuse?`,
      choices: [String(c), String(c + 1), String(c - 1), String(a + b)],
      answer: String(c),
      explanation: `${a}² + ${b}² = ${c}².`,
    });
  };

  generators.G8_transformations = function (grade, unit, difficulty) {
    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt:
        "What transformation slides a figure without changing its size or shape?",
      choices: ["Translation", "Rotation", "Reflection", "Dilation"],
      answer: "Translation",
      explanation:
        "A translation moves every point the same distance and direction.",
    });
  };

  generators.G8_statistics = generators.G6_statistics;

  generators.G8_slope = function (grade, unit, difficulty) {
    const x1 = randomInt(0, 5);
    const y1 = randomInt(0, 5);
    const rise = randomInt(1, 5);
    const run = randomInt(1, 5);

    const x2 = x1 + run;
    const y2 = y1 + rise;

    const answer = fractionString(rise, run);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is the slope through (${x1}, ${y1}) and (${x2}, ${y2})?`,
      choices: [
        answer,
        fractionString(run, rise),
        String(rise + run),
        String(rise - run),
      ],
      answer,
      explanation: `Slope = rise/run = ${rise}/${run}.`,
    });
  };

  generators.G8_wordProblems = generators.G8_linearEquations;

  // =====================================================
  // GRADE 9 — ALGEBRA 1
  // =====================================================

  generators.G9_linear = function (grade, unit, difficulty) {
    const x = randomInt(-10, 10);
    const a = randomInt(2, 10);
    const b = randomInt(-20, 20);
    const total = a * x + b;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Solve for x: ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(
        b
      )} = ${total}.`,
      choices: [String(x), String(x + 1), String(x - 1), String(total)],
      answer: String(x),
      explanation: `Isolate the x-term and divide by ${a}.`,
    });
  };

  generators.G9_functions = generators.G8_functions;
  generators.G9_systems = generators.G8_systems;

  generators.G9_inequalities = function (grade, unit, difficulty) {
    const x = randomInt(1, 15);
    const a = randomInt(2, 5);
    const b = randomInt(1, 10);
    const total = a * x + b;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Which value solves ${a}x + ${b} < ${total + a * 3}?`,
      choices: [String(x), String(x + 5), String(x + 10), String(x + 15)],
      answer: String(x),
      explanation: `${x} makes the left side less than the right side.`,
    });
  };

  generators.G9_exponents = generators.G8_exponents;

  generators.G9_polynomials = function (grade, unit, difficulty) {
    const a = randomInt(1, 9);
    const b = randomInt(1, 9);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Simplify: ${a}x + ${b}x.`,
      choices: [`${a + b}x`, `${a * b}x`, `${a + b}`, `${a}x²`],
      answer: `${a + b}x`,
      explanation: `Combine like terms: ${a}x + ${b}x = ${a + b}x.`,
    });
  };

  generators.G9_factoring = function (grade, unit, difficulty) {
    const a = randomInt(2, 10);
    const b = randomInt(1, 10);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Factor: ${a}x + ${a * b}.`,
      choices: [
        `${a}(x + ${b})`,
        `${b}(x + ${a})`,
        `${a + b}x`,
        `${a}(x - ${b})`,
      ],
      answer: `${a}(x + ${b})`,
      explanation: `The greatest common factor is ${a}.`,
    });
  };

  generators.G9_quadratics = function (grade, unit, difficulty) {
    const x = randomInt(1, 8);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `If x² = ${x * x}, what is the positive value of x?`,
      choices: [
        String(x),
        String(x + 1),
        String(Math.max(0, x - 1)),
        String(x * x),
      ],
      answer: String(x),
      explanation: `${x}² = ${x * x}.`,
    });
  };

  generators.G9_coordinate = generators.G5_coordinate;
  generators.G9_statistics = generators.G6_statistics;

  generators.G9_sequences = function (grade, unit, difficulty) {
    const first = randomInt(1, 10);
    const difference = randomInt(2, 8);
    const answer = first + difference * 3;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is the fourth term of the sequence ${first}, ${
        first + difference
      }, ${first + difference * 2}, ?`,
      choices: [
        String(answer),
        String(answer + difference),
        String(answer - difference),
        String(answer + 1),
      ],
      answer: String(answer),
      explanation: `The sequence increases by ${difference} each time.`,
    });
  };

  generators.G9_modeling = generators.G9_linear;

  // =====================================================
  // GRADE 10 — GEOMETRY
  // =====================================================

  generators.G10_foundations = function (grade, unit, difficulty) {
    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: "How many degrees are in a full circle?",
      choices: ["90°", "180°", "270°", "360°"],
      answer: "360°",
      explanation: "A full rotation is 360°.",
    });
  };

  generators.G10_angles = function (grade, unit, difficulty) {
    const a = randomInt(30, 120);
    const b = 180 - a;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Two angles form a straight line. One angle is ${a}°. What is the other?`,
      choices: [`${b}°`, `${a}°`, `${180 + a}°`, `${90 - a}°`],
      answer: `${b}°`,
      explanation: `Supplementary angles add to 180°.`,
    });
  };

  generators.G10_triangles = function (grade, unit, difficulty) {
    const a = randomInt(30, 80);
    const b = randomInt(30, 80);

    const c = 180 - a - b;

    if (c <= 0) {
      return generators.G10_triangles(grade, unit, difficulty);
    }

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `A triangle has angles ${a}° and ${b}°. What is the third angle?`,
      choices: [
        `${c}°`,
        `${c + 10}°`,
        `${Math.max(1, c - 10)}°`,
        `${180 - c}°`,
      ],
      answer: `${c}°`,
      explanation: `Triangle angles add to 180°.`,
    });
  };

  generators.G10_similarity = function (grade, unit, difficulty) {
    const scale = randomInt(2, 5);
    const small = randomInt(2, 10);
    const large = small * scale;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Similar figures have a scale factor of ${scale}. If a corresponding side is ${small}, what is the larger side?`,
      choices: [
        String(large),
        String(large + scale),
        String(large - scale),
        String(small + scale),
      ],
      answer: String(large),
      explanation: `${small} × ${scale} = ${large}.`,
    });
  };

  generators.G10_congruence = function (grade, unit, difficulty) {
    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: "What does it mean for two figures to be congruent?",
      choices: [
        "They have the same size and shape.",
        "They have the same area only.",
        "They have the same perimeter only.",
        "They have the same color.",
      ],
      answer: "They have the same size and shape.",
      explanation: "Congruent figures have the same size and shape.",
    });
  };

  generators.G10_quadrilaterals = function (grade, unit, difficulty) {
    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: "Which quadrilateral has exactly one pair of parallel sides?",
      choices: ["Trapezoid", "Square", "Rectangle", "Parallelogram"],
      answer: "Trapezoid",
      explanation:
        "A trapezoid has one pair of parallel sides in the common U.S. definition.",
    });
  };

  generators.G10_circles = function (grade, unit, difficulty) {
    const radius = randomInt(2, 10);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is the diameter of a circle with radius ${radius}?`,
      choices: [
        String(radius * 2),
        String(radius),
        String(radius + 2),
        String(radius * 3),
      ],
      answer: String(radius * 2),
      explanation: "Diameter = 2 × radius.",
    });
  };

  generators.G10_area = generators.G3_area;
  generators.G10_surfaceArea = function (grade, unit, difficulty) {
    const side = randomInt(2, 8);
    const answer = 6 * side * side;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is the surface area of a cube with side length ${side}?`,
      choices: [
        `${answer} square units`,
        `${side * side} square units`,
        `${4 * side * side} square units`,
        `${answer + side} square units`,
      ],
      answer: `${answer} square units`,
      explanation: `A cube has 6 square faces: 6 × ${side}² = ${answer}.`,
    });
  };

  generators.G10_volume = generators.G5_volume;

  generators.G10_coordinate = generators.G8_slope;

  generators.G10_trigonometry = function (grade, unit, difficulty) {
    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: "In a right triangle, which ratio represents sine?",
      choices: [
        "Opposite ÷ Hypotenuse",
        "Adjacent ÷ Hypotenuse",
        "Opposite ÷ Adjacent",
        "Hypotenuse ÷ Opposite",
      ],
      answer: "Opposite ÷ Hypotenuse",
      explanation: "SOH: sine = opposite/hypotenuse.",
    });
  };

  // =====================================================
  // GRADE 11 — ALGEBRA 2 / TRIG
  // =====================================================

  generators.G11_advancedAlgebra = generators.G9_linear;

  generators.G11_quadratics = function (grade, unit, difficulty) {
    const r1 = randomInt(1, 8);
    const r2 = randomInt(1, 8);

    const b = -(r1 + r2);
    const c = r1 * r2;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Which factored form represents x² ${
        b < 0 ? "-" : "+"
      } ${Math.abs(b)}x + ${c}?`,
      choices: [
        `(x - ${r1})(x - ${r2})`,
        `(x + ${r1})(x + ${r2})`,
        `(x - ${r1})(x + ${r2})`,
        `(x + ${r1})(x - ${r2 + 1})`,
      ],
      answer: `(x - ${r1})(x - ${r2})`,
      explanation: `The roots are ${r1} and ${r2}.`,
    });
  };

  generators.G11_polynomials = generators.G9_polynomials;
  generators.G11_rational = function (grade, unit, difficulty) {
    const x = randomInt(2, 10);
    const numerator = x * 2;
    const denominator = 2;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Simplify: ${numerator}x / ${denominator}.`,
      choices: [
        `${x}x`,
        `${numerator + denominator}x`,
        `${x + 1}x`,
        `${denominator}x`,
      ],
      answer: `${x}x`,
      explanation: `Divide the coefficient ${numerator} by ${denominator}.`,
    });
  };

  generators.G11_radicals = function (grade, unit, difficulty) {
    const n = randomChoice([4, 9, 16, 25, 36, 49]);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is √${n}?`,
      choices: [
        String(Math.sqrt(n)),
        String(Math.sqrt(n) + 1),
        String(Math.sqrt(n) - 1),
        String(n / 2),
      ],
      answer: String(Math.sqrt(n)),
      explanation: `${Math.sqrt(n)} × ${Math.sqrt(n)} = ${n}.`,
    });
  };

  generators.G11_complex = function (grade, unit, difficulty) {
    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: "What is i²?",
      choices: ["-1", "0", "1", "i"],
      answer: "-1",
      explanation: "By definition, i² = -1.",
    });
  };

  generators.G11_exponential = function (grade, unit, difficulty) {
    const base = randomChoice([2, 3]);
    const exponent = randomInt(2, 5);
    const answer = Math.pow(base, exponent);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is ${base}^${exponent}?`,
      choices: [
        String(answer),
        String(answer + base),
        String(answer - base),
        String(base * exponent),
      ],
      answer: String(answer),
      explanation: `${base} is multiplied by itself ${exponent} times.`,
    });
  };

  generators.G11_logarithms = function (grade, unit, difficulty) {
    const base = randomChoice([2, 10]);
    const exponent = randomInt(1, 4);
    const value = Math.pow(base, exponent);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is log base ${base} of ${value}?`,
      choices: [
        String(exponent),
        String(exponent + 1),
        String(Math.max(0, exponent - 1)),
        String(value),
      ],
      answer: String(exponent),
      explanation: `${base}^${exponent} = ${value}.`,
    });
  };

  generators.G11_sequences = function (grade, unit, difficulty) {
    const first = randomInt(1, 10);
    const difference = randomInt(2, 8);
    const terms = 5;
    const answer = first + difference * (terms - 1);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is the 5th term of an arithmetic sequence beginning ${first}, ${
        first + difference
      }, ${first + difference * 2}, ...?`,
      choices: [
        String(answer),
        String(answer + difference),
        String(answer - difference),
        String(answer + 1),
      ],
      answer: String(answer),
      explanation: `Add ${difference} four times to reach the 5th term.`,
    });
  };

  generators.G11_trigonometry = generators.G10_trigonometry;
  generators.G11_probability = generators.G6_probability;
  generators.G11_statistics = generators.G6_statistics;
  generators.G11_modeling = generators.G11_advancedAlgebra;

  // =====================================================
  // GRADE 12 — PRECALCULUS / INTRO CALCULUS
  // =====================================================

  generators.G12_functions = generators.G8_functions;

  generators.G12_advancedFunctions = function (grade, unit, difficulty) {
    const x = randomInt(1, 5);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `If f(x) = x² + 2x, what is f(${x})?`,
      choices: [
        String(x * x + 2 * x),
        String(x * x + x),
        String(2 * x),
        String(x * x),
      ],
      answer: String(x * x + 2 * x),
      explanation: `Substitute ${x}: ${x}² + 2(${x}) = ${x * x + 2 * x}.`,
    });
  };

  generators.G12_trigonometry = function (grade, unit, difficulty) {
    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: "What is sin(90°)?",
      choices: ["0", "1", "-1", "1/2"],
      answer: "1",
      explanation: "On the unit circle, sin(90°) = 1.",
    });
  };

  generators.G12_exponential = generators.G11_exponential;
  generators.G12_logarithms = generators.G11_logarithms;

  generators.G12_sequences = generators.G11_sequences;

  generators.G12_probability = generators.G6_probability;
  generators.G12_statistics = generators.G6_statistics;

  // -----------------------------------------------------
  // LIMITS
  // -----------------------------------------------------

  generators.G12_limits = function (grade, unit, difficulty) {
    const a = randomInt(1, 10);
    const answer = a * a + 2 * a + 1;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `Evaluate lim(x→${a}) (x² + 2x + 1).`,
      choices: [
        String(answer),
        String(answer + 1),
        String(answer - 1),
        String(a),
      ],
      answer: String(answer),
      explanation: `Because the polynomial is continuous, substitute x = ${a}.`,
    });
  };

  // -----------------------------------------------------
  // DERIVATIVES
  // -----------------------------------------------------

  generators.G12_derivatives = function (grade, unit, difficulty) {
    const n = randomInt(2, 6);
    const answer = n;

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is the derivative of f(x) = ${n}x?`,
      choices: [String(answer), `x`, `${n}x²`, "0"],
      answer: String(answer),
      explanation: `The derivative of ax is a.`,
    });
  };

  // -----------------------------------------------------
  // INTEGRALS
  // -----------------------------------------------------

  generators.G12_integrals = function (grade, unit, difficulty) {
    const n = randomInt(1, 5);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `What is ∫ ${n} dx?`,
      choices: [`${n}x + C`, `${n}x² + C`, `${n + 1}x + C`, `${n} + C`],
      answer: `${n}x + C`,
      explanation: `The antiderivative of a constant ${n} is ${n}x + C.`,
    });
  };

  // -----------------------------------------------------
  // CALCULUS APPLICATIONS
  // -----------------------------------------------------

  generators.G12_calculusApplications = function (grade, unit, difficulty) {
    const velocity = randomInt(2, 10);

    return createQuestion({
      grade,
      unit,
      difficulty,
      prompt: `If an object's velocity is constantly ${velocity} meters per second, how far does it travel in 3 seconds?`,
      choices: [
        `${velocity * 3} meters`,
        `${velocity + 3} meters`,
        `${velocity * 2} meters`,
        `${velocity} meters`,
      ],
      answer: `${velocity * 3} meters`,
      explanation: `Distance = velocity × time = ${velocity} × 3.`,
    });
  };

  // =====================================================
  // GENERATOR MAP
  // =====================================================

  const generatorMap = {
    K: [
      generators.K_counting,
      generators.K_addition,
      generators.K_subtraction,
      generators.K_shapes,
      generators.K_patterns,
      generators.K_measurement,
      generators.K_comparing,
      generators.K_placeValue,
      generators.K_time,
      generators.K_money,
      generators.K_data,
      generators.K_algebra,
    ],

    1: [
      generators.G1_addition,
      generators.G1_placeValue,
      generators.G1_counting,
      generators.G1_shapes,
      generators.G1_measurement,
      generators.G1_time,
      generators.G1_money,
      generators.G1_data,
      generators.G1_patterns,
      generators.G1_fractions,
      generators.G1_wordProblems,
      generators.G1_algebra,
    ],

    2: [
      generators.G2_addition,
      generators.G2_subtraction,
      generators.G2_multiplication,
      generators.G2_division,
      generators.G2_placeValue,
      generators.G2_money,
      generators.G2_time,
      generators.G2_measurement,
      generators.G2_shapes,
      generators.G2_fractions,
      generators.G2_data,
      generators.G2_wordProblems,
    ],

    3: [
      generators.G3_multiplication,
      generators.G3_division,
      generators.G3_fractions,
      generators.G3_decimals,
      generators.G3_area,
      generators.G3_perimeter,
      generators.G3_geometry,
      generators.G3_measurement,
      generators.G3_time,
      generators.G3_data,
      generators.G3_patterns,
      generators.G3_wordProblems,
    ],

    4: [
      generators.G4_multiDigit,
      generators.G4_factors,
      generators.G4_fractions,
      generators.G4_decimals,
      generators.G4_angles,
      generators.G4_geometry,
      generators.G4_area,
      generators.G4_perimeter,
      generators.G4_measurement,
      generators.G4_data,
      generators.G4_patterns,
      generators.G4_wordProblems,
    ],

    5: [
      generators.G5_fractions,
      generators.G5_decimals,
      generators.G5_multiDigit,
      generators.G5_expressions,
      generators.G5_volume,
      generators.G5_coordinate,
      generators.G5_geometry,
      generators.G5_measurement,
      generators.G5_data,
      generators.G5_patterns,
      generators.G5_ratios,
      generators.G5_wordProblems,
    ],

    6: [
      generators.G6_ratios,
      generators.G6_rates,
      generators.G6_fractions,
      generators.G6_decimals,
      generators.G6_percentages,
      generators.G6_expressions,
      generators.G6_equations,
      generators.G6_integers,
      generators.G6_geometry,
      generators.G6_areaVolume,
      generators.G6_statistics,
      generators.G6_probability,
    ],

    7: [
      generators.G7_ratios,
      generators.G7_percentages,
      generators.G7_expressions,
      generators.G7_equations,
      generators.G7_inequalities,
      generators.G7_integers,
      generators.G7_rational,
      generators.G7_geometry,
      generators.G7_probability,
      generators.G7_statistics,
      generators.G7_scale,
      generators.G7_wordProblems,
    ],

    8: [
      generators.G8_numberSystems,
      generators.G8_expressions,
      generators.G8_linearEquations,
      generators.G8_functions,
      generators.G8_systems,
      generators.G8_exponents,
      generators.G8_scientific,
      generators.G8_pythagorean,
      generators.G8_transformations,
      generators.G8_statistics,
      generators.G8_slope,
      generators.G8_wordProblems,
    ],

    9: [
      generators.G9_linear,
      generators.G9_functions,
      generators.G9_systems,
      generators.G9_inequalities,
      generators.G9_exponents,
      generators.G9_polynomials,
      generators.G9_factoring,
      generators.G9_quadratics,
      generators.G9_coordinate,
      generators.G9_statistics,
      generators.G9_sequences,
      generators.G9_modeling,
    ],

    10: [
      generators.G10_foundations,
      generators.G10_angles,
      generators.G10_triangles,
      generators.G10_similarity,
      generators.G10_congruence,
      generators.G10_quadrilaterals,
      generators.G10_circles,
      generators.G10_area,
      generators.G10_surfaceArea,
      generators.G10_volume,
      generators.G10_coordinate,
      generators.G10_trigonometry,
    ],

    11: [
      generators.G11_advancedAlgebra,
      generators.G11_quadratics,
      generators.G11_polynomials,
      generators.G11_rational,
      generators.G11_radicals,
      generators.G11_complex,
      generators.G11_exponential,
      generators.G11_logarithms,
      generators.G11_sequences,
      generators.G11_trigonometry,
      generators.G11_probability,
      generators.G11_modeling,
    ],

    12: [
      generators.G12_functions,
      generators.G12_advancedFunctions,
      generators.G12_trigonometry,
      generators.G12_exponential,
      generators.G12_logarithms,
      generators.G12_sequences,
      generators.G12_probability,
      generators.G12_statistics,
      generators.G12_limits,
      generators.G12_derivatives,
      generators.G12_integrals,
      generators.G12_calculusApplications,
    ],
  };

  // =====================================================
  // NORMALIZATION
  // =====================================================

  function normalizeGrade(grade) {
    if (grade === undefined || grade === null) {
      return null;
    }

    let value = String(grade).trim().toLowerCase();

    if (value === "kindergarten" || value === "kg") {
      return "K";
    }

    value = value
      .replace("grade", "")
      .replace("th", "")
      .replace("st", "")
      .replace("nd", "")
      .replace("rd", "")
      .trim();

    if (value === "k") {
      return "K";
    }

    return value;
  }

  function normalizeUnit(unit) {
    if (unit === undefined || unit === null) {
      return null;
    }

    const match = String(unit).match(/\d+/);

    return match ? Number(match[0]) : null;
  }

  // =====================================================
  // PUBLIC API
  // =====================================================

  function listGrades() {
    return Object.keys(curriculum).map((grade) => ({
      id: grade,
      label: gradeLabel(grade),
      units: 12,
    }));
  }

  function getUnits(grade) {
    grade = normalizeGrade(grade);

    if (!curriculum[grade]) {
      return [];
    }

    return curriculum[grade].map((title, index) => ({
      id: index + 1,
      unit: index + 1,
      title,
      questionCount: 1,
    }));
  }

  function getQuestions(grade, unit) {
    const result = [];

    for (let i = 0; i < 20; i++) {
      result.push(randomQuestion(grade, unit));
    }

    return result;
  }

  function getUnit(grade, unit) {
    grade = normalizeGrade(grade);
    unit = normalizeUnit(unit);

    if (!curriculum[grade] || !curriculum[grade][unit - 1]) {
      return null;
    }

    return {
      id: unit,
      unit,
      title: curriculum[grade][unit - 1],
      standards: [],
      questions: getQuestions(grade, unit),
    };
  }

  function randomQuestion(grade, unit, options = {}) {
    grade = normalizeGrade(grade);
    unit = normalizeUnit(unit);

    if (!curriculum[grade]) {
      throw new Error(`No curriculum exists for Grade ${grade}.`);
    }

    if (unit < 1 || unit > 12) {
      throw new Error(`Unit must be between 1 and 12.`);
    }

    const generatorsForGrade = generatorMap[grade];

    if (!generatorsForGrade || !generatorsForGrade[unit - 1]) {
      throw new Error(
        `No question generator exists for Grade ${grade}, Unit ${unit}.`
      );
    }

    const difficulty = ["easy", "medium", "hard"].includes(options.difficulty)
      ? options.difficulty
      : randomChoice(["easy", "medium", "hard"]);

    const generator = generatorsForGrade[unit - 1];

    const question = generator(grade, unit, difficulty);

    question.grade = grade;
    question.gradeLabel = gradeLabel(grade);
    question.unit = unit;
    question.unitTitle = curriculum[grade][unit - 1];

    return question;
  }

  function getQuestionForAccount(account) {
    if (!account) {
      throw new Error("No Infinite Math account supplied.");
    }

    let grade;
    let unit;

    if (account.gradeUnit) {
      const parsed = parseGradeUnit(account.gradeUnit);

      grade = parsed.grade;
      unit = parsed.unit;
    } else {
      grade = account.grade;
      unit = account.unit;
    }

    if (grade === undefined || unit === undefined) {
      throw new Error("Account is missing grade/unit.");
    }

    return randomQuestion(grade, unit, {
      difficulty: account.difficulty || "medium",
    });
  }

  function parseGradeUnit(value) {
    const text = String(value).trim();
    const parts = text.split(".");

    if (parts.length !== 2) {
      throw new Error(`Invalid grade/unit format: ${value}`);
    }

    const grade = normalizeGrade(parts[0]);
    const unit = Number(parts[1]);

    if (!curriculum[grade]) {
      throw new Error(`Invalid grade: ${grade}`);
    }

    if (!Number.isInteger(unit) || unit < 1 || unit > 12) {
      throw new Error("Unit must be between 1 and 12.");
    }

    return {
      grade,
      unit,
    };
  }

  function generateQuestionSet(
    grade,
    unit,
    difficulty = "medium",
    amount = 10
  ) {
    const questions = [];

    for (let i = 0; i < amount; i++) {
      questions.push(
        randomQuestion(grade, unit, {
          difficulty,
        })
      );
    }

    return questions;
  }

  // =====================================================
  // PROGRAMMATH
  // =====================================================

  const ProgramMath = {
    version: "2.0.0",

    listGrades,
    getUnits,
    getUnit,
    getQuestions,
    randomQuestion,
    getQuestionForAccount,
    generateQuestionSet,
    parseGradeUnit,
    normalizeGrade,
    normalizeUnit,

    gradeLabel,

    curriculum,
  };

  // =====================================================
  // GLOBAL EXPORT
  // =====================================================

  window.ProgramMath = ProgramMath;
})();
