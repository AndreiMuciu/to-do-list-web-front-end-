"use strict";

// atunci cand ultima actiune este sa dai delete si apoi dai reload fara sa apesi pe altceva se poate sterge primul element de asemenea

const inputContainer = document.querySelector(".input-container");
const taskList = document.querySelector("#taskList");
const addTaskBtn = document.querySelector(".add-task-btn");
const placeHolderTask = document.querySelector("#taskInput");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");

console.log(inputContainer, taskList, addTaskBtn);

class App {
  #finishedTasks = 0;
  #tasks = {
    tasksNumber: 0,
    arr: [],
  };

  constructor() {
    // Get data from local storage.
    this._getLocalStorage();

    addTaskBtn.addEventListener("click", this.addTask.bind(this));

    taskList.addEventListener("click", this.deleteTaskAndMarkATask.bind(this));

    btnCloseModal.addEventListener("click", this._closeModal);
    overlay.addEventListener("click", this._closeModal);
    document.addEventListener(
      "keydown",
      function (event) {
        if (event.key === "Escape") {
          if (!modal.classList.contains("hidden")) {
            this._closeModal();
          }
        }
      }.bind(this)
    );
    placeHolderTask.addEventListener(
      "keydown",
      function (e) {
        if (e.key === "Enter") {
          this.addTask();
        }
      }.bind(this)
    );
  }
  addTask(e) {
    if (!placeHolderTask.value) return alert(`You did't name any task`);
    if (this.#tasks.arr.find((task) => task === placeHolderTask.value))
      return alert("You added the same task once more");

    const html = `
    <li>
        <input type="checkbox" class="custom-checkbox" />${placeHolderTask.value}
        <button class="delete-task">delete</button>
    </li>`;
    taskList.insertAdjacentHTML("beforeend", html);
    this.#tasks.arr.push(placeHolderTask.value);
    this.#tasks.tasksNumber++;

    this._setLocalStorage();
    placeHolderTask.value = "";
  }
  deleteTaskAndMarkATask(e) {
    e.preventDefault();
    if (e.target.textContent === "delete") {
      e.target.parentElement.classList.add("hidden");
      this.#tasks.arr = this.#tasks.arr.filter((task) => {
        const aa = e.target.parentElement.textContent.slice(
          0,
          e.target.parentElement.textContent.indexOf(" delete")
        );
        return task !== aa.trim();
      });
      console.log(this.#tasks.arr);
      this.#tasks.tasksNumber--;
      localStorage.setItem("tasks", JSON.stringify(this.#tasks));
      if (e.target.parentElement.classList.contains("green-gradient-task")) {
        this.#finishedTasks--;
      }
    }
    if (e.target.type === "checkbox") {
      e.target.classList.add("hidden");
      e.target.parentElement.classList.add("green-gradient-task");
      this.#finishedTasks++;
    }

    this._showModal();
  }
  _showModal() {
    if (
      this.#tasks.tasksNumber !== 0 &&
      this.#tasks.tasksNumber === this.#finishedTasks
    ) {
      modal.classList.remove("hidden");
      overlay.classList.remove("hidden");
    }
  }
  _closeModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  }
  _setLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.#tasks));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("tasks"));
    if (!data) return;
    this.#tasks.tasksNumber = data.tasksNumber;
    this.#tasks.arr = data.arr;
    data.arr.forEach((task) => {
      const html = `
    <li>
        <input type="checkbox" class="custom-checkbox" />${task}
        <button class="delete-task">delete</button>
    </li>`;
      taskList.insertAdjacentHTML("beforeend", html);
    });
    console.log(data);
  }
}

const app = new App();
