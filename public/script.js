const BACKEND_BASE_API = "http://localhost:8000/";

function getAPIData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        resolve(data); // Resolve the promise with the API response data
      })
      .catch(error => {
        reject(error); // Reject the promise with the error
      });
  });
}

function updateTodo(todo){
  const url = BACKEND_BASE_API + `${"api/todos/" + todo.id}`
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todo)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.json();
    })
    .then(responseData => {
      console.log(responseData);
    })
    .catch(error => {
      console.error('Error:', error);
    });   
}

function updateTodosOrder(todos){
  const url = BACKEND_BASE_API + `${"api/todos/update_order/"}`
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todos)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.json();
    })
    .then(responseData => {
      console.log(responseData);
    })
    .catch(error => {
      console.error('Error:', error);
    });   
}

function deleteTodo(todo){
  const url = BACKEND_BASE_API + `${"api/todos/" + todo.id}`
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.json();
    })
    .then(responseData => {
      console.log(responseData);
    })
    .catch(error => {
      console.error('Error:', error);
    });   
}

//Change Header Background when scrolling down

function scrollHeader() {
  const scrollHeader = document.getElementById("header");
  if (window.scrollY >= 200) {
    scrollHeader.classList.add("scroll-header");
  } else {
    scrollHeader.classList.remove("scroll-header");
  }
}

window.addEventListener("scroll", scrollHeader);

function getTodos() {
  const url = BACKEND_BASE_API + "api/todos/";
  return getAPIData(url)
    .then(data => {
      return data;  // Return the data instead of logging it
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

window.addEventListener("load", () => {
 
  todos = JSON.parse(localStorage.getItem("todos")) || [];
  const nameInput = document.querySelector("#title");
  const newTodoForm = document.querySelector("#new-todo-form");

  const username = localStorage.getItem("username") || "";

  nameInput.value = username;

  nameInput.addEventListener("change", (e) => {
    localStorage.setItem("username", e.target.value);
    DisplayTodos();
  });

  document.addEventListener("submit", (e) => {
    e.preventDefault();

    const todo = {
      title: e.target.elements.title?.value,
      content: e.target.elements.content.value,
      category: e.target.elements.category.value,
      done: false,
      createdAt: new Date().getTime(),
    };
    const url = BACKEND_BASE_API + "api/todos/";
    const data = todo;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        DisplayTodos();
      })
      .then(responseData => {
        console.log(responseData);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // Reset the form
    e.target.reset();
  });

  DisplayTodos();

  addDragListeners();

});

function DisplayTodos(owner) {
  const nameInput = document.querySelector("#title");
  if (!owner || owner === ""){
    owner = nameInput.value;
  
    if (!owner || owner === ""){
      owner = localStorage.getItem("username") || "";
    }
  }

  if(owner === ""){
    const defaultUser = "Kennedy"
    owner = defaultUser;
    nameInput.value = defaultUser;
  }

  const todoList = document.querySelector("#todo-list");
  todoList.innerHTML = "";
  const todosURL = BACKEND_BASE_API + `api/todos/?title=${owner}`;

  getAPIData(todosURL)
  .then(data => {
    let days = [];
    function queryDay(todo){
      for (index=0; index<=days.length; index++){
        if(days[index] === todo.created_at.split("T")[0]){
          return {day:todo.created_at.split("T")[0], isNew:false};         
        }
      } 
      days.push(todo.created_at.split("T")[0]); 
      return {day:todo.created_at.split("T")[0], isNew:true};      
    }
    days.forEach((day)=>{
      console.log(day);
    })
    data.forEach((todo) => {
      dayData = queryDay(todo);
      // if the day is new, create a new day canvas for it else append it to the existing days canvas. 
      let dayCanvas=document.getElementById(dayData.day);
      var canvasListId=dayData.day + "-list";      
      let canvasList=document.getElementById(canvasListId);
      if(dayData.isNew){
        dayCanvas=document.createElement("div");
        dayCanvas.classList.add("day-canvas");
        dayCanvas.setAttribute("id", dayData.day);
        dayCanvas.setAttribute('data-timestamp', dayData.day);

        const dayLabel=document.createElement("h3");
        dayLabel.textContent=dayData.day;
        dayLabel.setAttribute('data-timestamp', dayData.day);

        canvasList=document.createElement("div");
        canvasList.setAttribute("id", canvasListId);
        canvasList.setAttribute('data-timestamp', dayData.day);

        dayCanvas.appendChild(dayLabel);       
      }
      
      const todoItem = document.createElement("div");
      todoItem.classList.add("todo-item");
      todoItem.draggable = true;
      // Inside the forEach loop where you create todoItem divs
      todoItem.setAttribute("draggable", "true");
      todoItem.classList.add("draggable-item");
      todoItem.setAttribute('data-timestamp', dayData.day);
      todoItem.setAttribute('id', todo.id);
      todoItem.setAttribute('order_id', todo.order_id);
      todoItem.setAttribute('id-stamp', todo.id);

      const label = document.createElement("label");
      label.setAttribute('data-timestamp', dayData.day);
      label.setAttribute('id-stamp', todo.id);

      const input = document.createElement("input");
      input.setAttribute('data-timestamp', dayData.day);
      input.setAttribute('id-stamp', todo.id);

      const span = document.createElement("span");
      span.setAttribute('data-timestamp', dayData.day);
      span.setAttribute('id-stamp', todo.id);

      const content = document.createElement("div");
      content.setAttribute('data-timestamp', dayData.day);
      content.setAttribute('id-stamp', todo.id);

      const actions = document.createElement("div");
      actions.setAttribute('data-timestamp', dayData.day);
      actions.setAttribute('id-stamp', todo.id);

      const edit = document.createElement("button");
      edit.setAttribute('data-timestamp', dayData.day);
      edit.setAttribute('id-stamp', todo.id);

      const deleteButton = document.createElement("button");
      deleteButton.setAttribute('data-timestamp', dayData.day);
      deleteButton.setAttribute('id-stamp', todo.id);

      input.type = "checkbox";
      input.checked = todo.done;
      span.classList.add("tasks");
      if (todo.category == "personal") {
        span.classList.add("personal");
      } else if (todo.category == "business") {
        span.classList.add("business");
      } else if (todo.category == "educational") {
        span.classList.add("educational");
      } else if (todo.category == "financial") {
        span.classList.add("financial");
      } else if (todo.category == "work") {
        span.classList.add("work");
      } else if (todo.category == "home") {
        span.classList.add("home");
      } else if (todo.category == "health_and_fitness") {
        span.classList.add("health_and_fitness");
      } else if (todo.category == "travel") {
        span.classList.add("travel");
      } else {
        span.classList.add("creative");
      }

      content.classList.add("todo-content");
      actions.classList.add("actions");
      edit.classList.add("edit");
      deleteButton.classList.add("delete");

      content.innerHTML = `<input type="text" name="activity" id="${"input" + todo.id}" input-id-stamp="${todo.id}" order-id="${todo.order_id}" value="${todo.content}" readonly=true data-timestamp="${dayData.day}">`;
      edit.innerHTML = "Edit";
      deleteButton.innerHTML = "Delete";

      label.appendChild(input);
      label.appendChild(span);
      actions.appendChild(edit);
      actions.appendChild(deleteButton);
      todoItem.appendChild(label);
      todoItem.appendChild(content);
      todoItem.appendChild(actions);

      canvasList.appendChild(todoItem);

      if(dayData.isNew){
        dayCanvas.appendChild(canvasList);
        todoList.appendChild(dayCanvas)
      }

      if (todo.done) {
        todoItem.classList.add("done");
      }

      input.addEventListener("change", (e) => {
        todo.done = e.target.checked;
        updateTodo(todo);
        if (todo.done) {
          todoItem.classList.add("done");
        } else {
          todoItem.classList.remove("done");
        }

        DisplayTodos();
      });

      const contentInput = content.querySelector("input");
      contentInput.addEventListener("keypress", function(event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          contentInput.value = event.target.value;
          todo.content = event.target.value;
          contentInput.setAttribute("readonly", true);
          updateTodo(todo);
        }
      });

      edit.addEventListener("click", () => {
        const input = content.querySelector("input");
        input.removeAttribute("readonly");
        input.focus();
        input.addEventListener("blur", (e) => {
          input.setAttribute("readonly", true);
          todo.content = e.target.value;
          DisplayTodos();
        });
      });

      deleteButton.addEventListener("click", () => {
        deleteTodo(todo);
        DisplayTodos();
      });

    // Drag and Drop functionality
    todoItem.addEventListener("dragstart", dragStart);
    todoItem.addEventListener("dragover", dragOver);
    todoItem.addEventListener("dragleave", dragLeave);
    todoItem.addEventListener("drop", dragDrop);
    todoItem.addEventListener("dragend", dragEnd);

    canvasList.appendChild(todoItem);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
  };

  addDragListeners();

  function addDragListeners() {
    const draggableElements = document.querySelectorAll(".draggable-item");

    draggableElements.forEach((element) => {
      element.addEventListener("dragstart", dragStart);
      element.addEventListener("dragover", dragOver);
      element.addEventListener("dragleave", dragLeave);
      element.addEventListener("drop", dragDrop);
      element.addEventListener("dragend", dragEnd);
    });
  } 

  // Drag and Drop functionality
  let draggedItem = null;
  let fromID = ""
  let fromOrderID = ""
  let fromValue = ""
  let toID = ""
  let toOrderID = ""
  let toValue = ""
  let patchData = []

  function dragStart(event) {
    draggedItem = this;
    this.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/html", this.innerHTML);

    const idStamp = this.getAttribute("id-stamp")
    // Get input element with the input-id-stamp of idStamp
    const currentInput = document.querySelectorAll(`[input-id-stamp="${idStamp}"]`);
    const currentInmputOrderId = currentInput[0].getAttribute("order-id")
    fromID = idStamp
    fromOrderID = currentInmputOrderId
    fromValue = currentInput[0].value
  };

  function dragOver(event) {
  event.preventDefault();
  this.classList.add("drag-over");
  event.dataTransfer.dropEffect = "move";
  };

  function dragLeave() {
  this.classList.remove("drag-over");
  };

  function dragDrop(event) {
    if(draggedItem !== this) {
      draggedItem.innerHTML = this.innerHTML;
      this.innerHTML = event.dataTransfer.getData("text/html");

      const idStamp = this.getAttribute("id-stamp")
      // Get input element with the input-id-stamp of idStamp
      const targetInput = document.querySelectorAll(`[input-id-stamp="${idStamp}"]`);
      const targetInmputOrderId = targetInput[0].getAttribute("order-id")
      toID=idStamp
      toOrderID = targetInmputOrderId
      toValue = targetInput[0].value
    }
    this.classList.remove("drag-over");
  };

  function dragEnd(event) {
    this.classList.remove("dragging");

    const fromData = {
      id : parseInt(fromID),
      order_id: parseInt(toOrderID),
      content: fromValue
    }

    const toData = {
      id : parseInt(toID),
      order_id: parseInt(fromOrderID),
      content: toValue
    }
    const todosData = [fromData, toData]
    console.log("The update data is ", todosData);
    updateTodosOrder(todosData)
  };

  document.addEventListener("DOMContentLoaded", function () {
  const todoListElements = document.getElementById("todo-list");

  // Get all draggable elements
  const draggableElements = document.getElementsByClassName("draggable-item");
  Array.from(draggableElements).forEach(function (element) {
  element.addEventListener("dragstart", dragStart);
  element.addEventListener("dragover", dragOver);
  element.addEventListener("dragleave", dragLeave);
  element.addEventListener("drop", dragDrop);
  element.addEventListener("dragend", dragEnd);
  });
  });
