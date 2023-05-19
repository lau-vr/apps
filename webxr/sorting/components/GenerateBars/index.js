import {
  bubbleSort,
  heapSort,
  insertionSort,
  mergeSort,
  quickSort,
  selectionSort,
} from "./algorithms";

var numBars = 20;
var bars = [];
var visualizationSpeed = 5;
var sortedArr = [];
var isSorting = false;
var sortingIndex = 0;
var isManualMode = false;
var manualChosenAlgorithm = null;
var isHolding = false;
var heldBar;
var heldBarValue;
var originalBarIndex = 0;
var oldBarIndex = 0;

var timeout = null;
var placementTimeout = null;
var interval = null;
var sortingInterval = null;

const generateBars = () => {
  bars = [];
  for (let i = 0; i < numBars; i++) {
    const value = Math.random() * 10 + 1;
    bars.push(value);
  }
};

const displayBars = (arr, oldArr) => {
  const container = document.getElementById("container");
  container.innerHTML = "";

  for (let i = 0; i < arr.length; i++) {
    const bar = document.createElement("a-box");
    const height = arr[i] * 0.5;

    bar.setAttribute("class", "bar");
    bar.setAttribute("height", `${height}`);
    bar.setAttribute("width", "0.2");
    bar.setAttribute("depth", "0.2");
    bar.setAttribute("color", arr[i] === oldArr[i] ? "#1AAC97" : "orange");
    bar.setAttribute(
      "position",
      `${i * 0.3 - ((arr.length - 1) * 0.3) / 2} ${height / 2 + 0.05} -5`
    );

    bar.addEventListener("mouseenter", () => {
      if (
        isManualMode &&
        manualChosenAlgorithm &&
        sortedArr.length > 1 &&
        sortingIndex + 1 !== sortedArr.length
      ) {
        const changes = sortedArr[sortingIndex + 1].map(
          (value, index) => value !== sortedArr[sortingIndex][index]
        );
        if (!isHolding) {
          bar.setAttribute("color", "green");
          const barHolder = document.getElementById("barHolder");
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(() => {
            if (changes[i]) {
              isHolding = true;
              heldBar = bar.cloneNode(true);
              heldBarValue = bars[i];
              originalBarIndex = i;
              oldBarIndex = i;
              heldBar.setAttribute("position", "0 0 0");
              barHolder.appendChild(heldBar);
              bar.setAttribute("color", "orange");
            } else {
              bar.setAttribute("color", "red");
              setTimeout(() => {
                bar.setAttribute("color", "#1AAC97");
              }, 250);
            }
          }, 700);
        } else if (i !== originalBarIndex && i !== oldBarIndex) {
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(() => {
            [bars[oldBarIndex], bars[originalBarIndex]] = [
              bars[originalBarIndex],
              bars[oldBarIndex],
            ];

            oldBarIndex = i;
            [bars[i], bars[originalBarIndex]] = [
              bars[originalBarIndex],
              bars[i],
            ];
            displayBars(
              bars,
              bars.map((value, index) =>
                index === oldBarIndex || index === originalBarIndex
                  ? value + 0.1
                  : value
              )
            );
            clearTimeout(placementTimeout);
            placementTimeout = setTimeout(() => {
              if (heldBarValue === sortedArr[sortingIndex + 1][i]) {
                isHolding = false;
                barHolder.removeChild(heldBar);
                displayBars(bars, bars);
                if (arraysMatch(bars, sortedArr[sortingIndex + 1])) {
                  sortingIndex++;
                  if (sortingIndex + 1 === sortedArr.length) {
                    Array.from(document.getElementsByClassName("bar")).forEach(
                      (bar) => {
                        bar.setAttribute("color", "green");
                      }
                    );
                  }
                }
              } else {
                heldBar.setAttribute("color", "red");
                setTimeout(() => {
                  heldBar.setAttribute("color", "green");
                }, 250);
              }
            }, 700);
          }, 10);
        }
      }
    });

    bar.addEventListener("mouseleave", () => {
      if (
        isManualMode &&
        manualChosenAlgorithm &&
        sortedArr.length > 1 &&
        sortingIndex + 1 !== sortedArr.length
      ) {
        if (timeout) timeout = clearTimeout(timeout);
        bar.setAttribute("color", "#1AAC97");
      }
    });

    container.appendChild(bar);
  }
};

const sort = () => {
  if (sortingIndex === sortedArr.length) {
    sortingInterval = clearInterval(sortingInterval);
    displayBars(sortedArr[sortingIndex - 1], sortedArr[sortingIndex - 1]);
  } else {
    displayBars(
      sortedArr[sortingIndex],
      sortedArr[sortingIndex === 0 ? sortingIndex : sortingIndex - 1]
    );
    sortingIndex++;
  }
};

const startSorting = (sortFunction) => {
  sortedArr = sortFunction([...bars]);
  sortingIndex = 0;
  isSorting = true;
  sortingInterval = setInterval(sort, 1000 / visualizationSpeed);
};

window.addEventListener("load", (event) => {
  generateBars();
  displayBars(bars, bars);

  const sizeSlider = document.getElementById("size-slider");
  const sizePlus = document.getElementById("size-plus");
  const sizeMinus = document.getElementById("size-minus");

  const speedSlider = document.getElementById("speed-slider");
  const speedPlus = document.getElementById("speed-plus");
  const speedMinus = document.getElementById("speed-minus");

  const gotIt = document.getElementById("got-it");
  const instructions = document.getElementById("instructions");
  const newArray = document.getElementById("newArray");
  const manualSolve = document.getElementById("manualSolve");
  const algDesc = document.getElementById("alg-desc");
  const sortButtons = document.getElementsByClassName("sortButton");

  setButtonColorEvents([sizePlus, sizeMinus, speedPlus, speedMinus]);

  sizePlus.addEventListener("mouseenter", () => {
    let sliderAttributes = sizeSlider.getAttribute("my-slider");
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (numBars < sliderAttributes.max) {
        numBars++;
        if (!isManualMode) {
          if (!isSorting) {
            generateBars();
            displayBars(bars, bars);
          }
        } else {
          if (isHolding) {
            document.getElementById("barHolder").removeChild(heldBar);
            isHolding = false;
          }
          sortingIndex = 0;
          generateBars();
          if (manualChosenAlgorithm) {
            if (manualChosenAlgorithm === "bubbleSort")
              sortedArr = bubbleSort([...bars]);
            else if (manualChosenAlgorithm === "insertionSort")
              sortedArr = insertionSort([...bars]);
            else if (manualChosenAlgorithm === "selectionSort")
              sortedArr = selectionSort([...bars]);
            else if (manualChosenAlgorithm === "quickSort")
              sortedArr = quickSort([...bars]);
            else if (manualChosenAlgorithm === "mergeSort")
              sortedArr = mergeSort([...bars]);
            else if (manualChosenAlgorithm === "heapSort")
              sortedArr = heapSort([...bars]);
            if (sortedArr.length <= 1)
              while (arraysMatch(bars, sortedArr[sortingIndex])) {
                sortingIndex++;
              }
          }
          displayBars(bars, bars);
        }
        sliderAttributes["value"] = numBars;
        sizeSlider.setAttribute("my-slider", sliderAttributes);
      }
    }, 150);
  });

  sizePlus.addEventListener("mouseleave", () => {
    if (interval) interval = clearInterval(interval);
  });

  sizeMinus.addEventListener("mouseenter", () => {
    let sliderAttributes = sizeSlider.getAttribute("my-slider");
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (numBars > sliderAttributes.min) {
        numBars--;
        if (!isManualMode) {
          if (!isSorting) {
            generateBars();
            displayBars(bars, bars);
          }
        } else {
          if (isHolding) {
            document.getElementById("barHolder").removeChild(heldBar);
            isHolding = false;
          }
          sortingIndex = 0;
          generateBars();
          if (manualChosenAlgorithm) {
            if (manualChosenAlgorithm === "bubbleSort")
              sortedArr = bubbleSort([...bars]);
            else if (manualChosenAlgorithm === "insertionSort")
              sortedArr = insertionSort([...bars]);
            else if (manualChosenAlgorithm === "selectionSort")
              sortedArr = selectionSort([...bars]);
            else if (manualChosenAlgorithm === "quickSort")
              sortedArr = quickSort([...bars]);
            else if (manualChosenAlgorithm === "mergeSort")
              sortedArr = mergeSort([...bars]);
            else if (manualChosenAlgorithm === "heapSort")
              sortedArr = heapSort([...bars]);
            if (sortedArr.length <= 1)
              while (arraysMatch(bars, sortedArr[sortingIndex])) {
                sortingIndex++;
              }
          }
          displayBars(bars, bars);
        }
        sliderAttributes["value"] = numBars;
        sizeSlider.setAttribute("my-slider", sliderAttributes);
      }
    }, 150);
  });

  sizeMinus.addEventListener("mouseleave", () => {
    if (interval) interval = clearInterval(interval);
  });

  speedPlus.addEventListener("mouseenter", () => {
    if (!isManualMode) {
      let sliderAttributes = speedSlider.getAttribute("my-slider");
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        if (visualizationSpeed < sliderAttributes.max) {
          visualizationSpeed++;
          if (isSorting && sortingIndex < sortedArr.length) {
            clearInterval(sortingInterval);
            sortingInterval = setInterval(sort, 1000 / visualizationSpeed);
          }
          sliderAttributes["value"] = visualizationSpeed;
          speedSlider.setAttribute("my-slider", sliderAttributes);
        }
      }, 250);
    }
  });

  speedPlus.addEventListener("mouseleave", () => {
    if (!isManualMode) {
      if (interval) interval = clearInterval(interval);
    }
  });

  speedMinus.addEventListener("mouseenter", () => {
    if (!isManualMode) {
      let sliderAttributes = speedSlider.getAttribute("my-slider");
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        if (visualizationSpeed > sliderAttributes.min) {
          visualizationSpeed--;
          if (isSorting && sortingIndex < sortedArr.length) {
            clearInterval(sortingInterval);
            sortingInterval = setInterval(sort, 1000 / visualizationSpeed);
          }
          sliderAttributes["value"] = visualizationSpeed;
          speedSlider.setAttribute("my-slider", sliderAttributes);
        }
      }, 250);
    }
  });

  speedMinus.addEventListener("mouseleave", () => {
    if (!isManualMode) {
      if (interval) interval = clearInterval(interval);
    }
  });

  gotIt.addEventListener("mouseenter", () => {
    gotIt.setAttribute("material", "color: #007D6B");
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      instructions.setAttribute("visible", "false");
      instructions.setAttribute("position", "0 -20 0");
    }, 1000);
  });

  gotIt.addEventListener("mouseleave", () => {
    gotIt.setAttribute("material", "color: #1AAC97");
    if (timeout) timeout = clearTimeout(timeout);
  });

  newArray.addEventListener("mouseenter", () => {
    newArray.setAttribute("material", "color: #007D6B");
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      generateBars();
      displayBars(bars, bars);
      if (!isManualMode) {
        isSorting = false;
        if (sortingInterval) clearInterval(sortingInterval);
      } else if (manualChosenAlgorithm) {
        if (isHolding) {
          document.getElementById("barHolder").removeChild(heldBar);
          isHolding = false;
        }
        sortingIndex = 0;
        if (manualChosenAlgorithm === "bubbleSort")
          sortedArr = bubbleSort([...bars]);
        else if (manualChosenAlgorithm === "insertionSort")
          sortedArr = insertionSort([...bars]);
        else if (manualChosenAlgorithm === "selectionSort")
          sortedArr = selectionSort([...bars]);
        else if (manualChosenAlgorithm === "quickSort")
          sortedArr = quickSort([...bars]);
        else if (manualChosenAlgorithm === "mergeSort")
          sortedArr = mergeSort([...bars]);
        else if (manualChosenAlgorithm === "heapSort")
          sortedArr = heapSort([...bars]);
        if (sortedArr.length <= 1)
          while (arraysMatch(bars, sortedArr[sortingIndex])) {
            sortingIndex++;
          }
      }
      newArray.setAttribute("material", "color: #333");
      timeout = null;
    }, 1000);
  });

  newArray.addEventListener("mouseleave", () => {
    newArray.setAttribute("material", "color: #333");
    if (timeout) timeout = clearTimeout(timeout);
  });

  manualSolve.addEventListener("mouseenter", () => {
    manualSolve.setAttribute("material", "color: #007D6B");
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      isManualMode = !isManualMode;
      if (isManualMode) {
        speedSlider.setAttribute("visible", false);
        speedPlus.setAttribute("visible", false);
        speedMinus.setAttribute("visible", false);
        document.getElementById("mergeBg").setAttribute("visible", false);
        document.getElementById("heapBg").setAttribute("visible", false);
        document.getElementById("quickBg").setAttribute("visible", false);
        document.getElementById("heapBg").setAttribute("position", "0 -1.2 0");
        document
          .getElementById("selectionBg")
          .setAttribute("position", "0 -0.4 0");
      } else {
        speedSlider.setAttribute("visible", true);
        speedPlus.setAttribute("visible", true);
        speedMinus.setAttribute("visible", true);
        document.getElementById("mergeBg").setAttribute("visible", true);
        document.getElementById("heapBg").setAttribute("visible", true);
        document.getElementById("quickBg").setAttribute("visible", true);
        document.getElementById("heapBg").setAttribute("position", "0 -0.4 0");
        document
          .getElementById("selectionBg")
          .setAttribute("position", "0 -1.2 0");
      }
      document
        .getElementById("mode-text")
        .setAttribute(
          "value",
          isManualMode ? "Switch to Visualization" : "Switch to Manual Solving"
        );
      if (isHolding) {
        document.getElementById("barHolder").removeChild(heldBar);
        isHolding = false;
      }
      if (manualChosenAlgorithm) {
        document
          .getElementById(manualChosenAlgorithm)
          .setAttribute("material", "color: #333");
        manualChosenAlgorithm = "";
      }
      if (isSorting) {
        sortingInterval = clearInterval(sortingInterval);
        displayBars(bars, bars);
        isSorting = false;
      }
      manualSolve.setAttribute("material", "color: #333");
      timeout = null;
    }, 1000);
  });

  manualSolve.addEventListener("mouseleave", () => {
    manualSolve.setAttribute("material", "color: #333");
    if (timeout) timeout = clearTimeout(timeout);
  });

  Array.from(sortButtons).forEach((button) => {
    const id = button.getAttribute("id");
    const bg = document.getElementById(
      `${id.substring(0, id.indexOf("Sort"))}Bg`
    );

    button.addEventListener("mouseenter", () => {
      if (bg.getAttribute("visible")) {
        const buttonPos = {
          ...bg.getAttribute("position"),
        };
        buttonPos.x = -1.7;
        algDesc.setAttribute("position", buttonPos);
        const descText = document.getElementById("alg-desc-text");
        if (id === "bubbleSort")
          descText.setAttribute(
            "value",
            "Repeatedly compares adjacent elements and swaps them if they are in the wrong order."
          );
        else if (id === "insertionSort")
          descText.setAttribute(
            "value",
            "Builds the sorted array one item at a time by inserting each next element into its correct position."
          );
        else if (id === "selectionSort")
          descText.setAttribute(
            "value",
            "Repeatedly finds the minimum element from the unsorted part of the array and swaps it with the element at the beginning of the unsorted part."
          );
        else if (id === "quickSort")
          descText.setAttribute(
            "value",
            "Picks a pivot element and partitions the array into two sub-arrays, with one containing elements smaller than the pivot and the other containing elements greater than the pivot, and then recursively sorts the sub-arrays."
          );
        else if (id === "mergeSort")
          descText.setAttribute(
            "value",
            "Divides the unsorted list into sublists, sorts them independently, and then merges the sorted sublists to produce a sorted output."
          );
        else if (id === "heapSort")
          descText.setAttribute(
            "value",
            "Uses a binary heap data structure to repeatedly extract the maximum element and build a sorted array."
          );
      }
      if (!isManualMode) {
        if (!isSorting) {
          button.setAttribute("material", "color: #007D6B");
          if (timeout) timeout = clearTimeout(timeout);
          timeout = setTimeout(() => {
            if (id === "bubbleSort") startSorting(bubbleSort);
            else if (id === "insertionSort") startSorting(insertionSort);
            else if (id === "selectionSort") startSorting(selectionSort);
            else if (id === "quickSort") startSorting(quickSort);
            else if (id === "mergeSort") startSorting(mergeSort);
            else if (id === "heapSort") startSorting(heapSort);
            button.setAttribute("material", "color: #333");
          }, 1000);
        }
      } else if (manualChosenAlgorithm !== id) {
        button.setAttribute("material", "color: #007D6B");
        if (timeout) timeout = clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (isHolding) {
            document.getElementById("barHolder").removeChild(heldBar);
            isHolding = false;
          }
          if (manualChosenAlgorithm) {
            document
              .getElementById(manualChosenAlgorithm)
              .setAttribute("material", "color: #333");
          }
          manualChosenAlgorithm = id;
          sortingIndex = 0;
          if (id === "bubbleSort") sortedArr = bubbleSort([...bars]);
          else if (id === "insertionSort") sortedArr = insertionSort([...bars]);
          else if (id === "selectionSort") sortedArr = selectionSort([...bars]);
          else if (id === "quickSort") sortedArr = quickSort([...bars]);
          else if (id === "mergeSort") sortedArr = mergeSort([...bars]);
          else if (id === "heapSort") sortedArr = heapSort([...bars]);
          if (sortedArr.length <= 1) {
            while (arraysMatch(bars, sortedArr[sortingIndex + 1])) {
              sortingIndex++;
            }
          }
          if (!arraysMatch(bars, sortedArr[sortingIndex + 1]))
            displayBars(bars, bars);
          button.setAttribute("material", "color: green");
        }, 1000);
      }
    });

    button.addEventListener("mouseleave", () => {
      if (!isManualMode) {
        if (!isSorting) button.setAttribute("material", "color: #333");
      } else {
        const id = button.getAttribute("id");
        if (manualChosenAlgorithm !== id)
          button.setAttribute("material", "color: #333");
      }
      if (timeout) timeout = clearTimeout(timeout);
    });
  });
});

function setButtonColorEvents(buttonsArr) {
  buttonsArr.forEach((button) => {
    button.addEventListener("model-loaded", () => {
      const obj = button.getObject3D("mesh");
      obj.traverse((node) => {
        if (node.name === "Sketchup003" || node.name === "Cylinder007") {
          node.children.forEach((mesh) => {
            mesh.material.color.set("rgb(0, 150, 255)");
          });
        }
      });

      button.addEventListener("mouseenter", () => {
        const obj = button.getObject3D("mesh");
        obj.traverse((node) => {
          if (node.name === "Sketchup003" || node.name === "Cylinder007") {
            node.children.forEach((mesh) => {
              mesh.material.color.set("rgb(0, 75, 127)");
            });
          }
        });
      });

      button.addEventListener("mouseleave", () => {
        const obj = button.getObject3D("mesh");
        obj.traverse((node) => {
          if (node.name === "Sketchup003" || node.name === "Cylinder007") {
            node.children.forEach((mesh) => {
              mesh.material.color.set("rgb(0, 150, 255)");
            });
          }
        });
      });
    });
  });
}

const arraysMatch = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;

  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
};
