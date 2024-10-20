document.addEventListener("DOMContentLoaded", main);

function main() {
  const outputEl = document.getElementById("output");
  const inputEl = document.getElementById("input");
  let currentText = "";
  inputEl.addEventListener("change", (ev) => {
    const { toDelete, toInsert } = getTransformations(
      currentText,
      ev.target.value
    );
    currentText = ev.target.value;

    // DELETE
    toDelete.forEach((action) => {
      const childEl = outputEl.children.item(action.at);
      outputEl.removeChild(childEl);
    });

    // INSERT
    if (outputEl.children.length > 0) {
      toInsert.forEach((action) => {
        const newChild = createLetterEl(action.char);
        if (action.at > outputEl.children.length - 1) {
          outputEl.appendChild(newChild);
        } else {
          outputEl.children
            .item(action.at)
            .insertAdjacentElement("beforebegin", newChild);
        }
      });
    } else {
      outputEl.append(
        ...ev.target.value.split("").map((char) => createLetterEl(char))
      );
    }
  });
}

function createLetterEl(char) {
  const spanEl = document.createElement("span");
  spanEl.className = "fade-in";
  spanEl.textContent = char;
  return spanEl;
}

function longestCommonSubsequence(text1, text2) {
  const dp = Array.from({ length: text1.length + 1 }, () =>
    Array(text2.length + 1).fill(0)
  );

  for (let i = 1; i <= text1.length; i++) {
    for (let j = 1; j <= text2.length; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let lcs = "";
  let i = text1.length;
  let j = text2.length;

  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) {
      lcs = text1[i - 1] + lcs;
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return lcs;
}

function getTransformations(source, target) {
  const lcs = longestCommonSubsequence(source, target);
  const toDelete = [];

  for (let j = 0, s = 0; j < source.length; j++) {
    if (lcs[s] !== source[j]) {
      toDelete.push({ at: j, char: source[j], to: "delete" });
    } else {
      s++;
    }
  }
  const toInsert = [];
  for (let j = 0, s = 0; j < target.length; j++) {
    if (lcs[s] !== target[j]) {
      toInsert.push({ at: s, char: target[j], to: "insert" });
    } else {
      s++;
    }
  }
  return { toDelete: toDelete.reverse(), toInsert: toInsert.reverse() };
}

function executeTextActions(text, actions) {
  let copy = text.split("");
  for (const action of actions.reverse()) {
    if (action.to === "delete") copy.splice(action.at, 1);
    if (action.to === "insert") copy.splice(action.at, 0, action.char);
  }
  return copy.join("");
}
