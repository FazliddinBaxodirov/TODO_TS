"use strict";
const setState = (key, value) => {
    if (typeof value === "string") {
        localStorage.setItem(key, value);
    }
    else {
        localStorage.setItem(key, JSON.stringify(value));
    }
};
const getState = (key) => {
    const data = localStorage.getItem(key);
    if (data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
    return null;
};
let elTodoForm = document.querySelector('.todo_form');
let elTodoInput = document.querySelector('.todo_input');
let elTodoList = document.querySelector('.todo_list');
let elModalWrapper = document.querySelector('.modal_wrapper');
let elModalInner = document.querySelector('.modal_inner');
let todos = getState("todos") || [];
elTodoForm === null || elTodoForm === void 0 ? void 0 : elTodoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = {
        id: todos.length ? todos[todos.length - 1].id + 1 : 1,
        value: elTodoInput.value
    };
    todos.push(data);
    renderTodos(todos, elTodoList);
    e.target.reset();
    setState("todos", todos);
});
function renderTodos(arr, list) {
    list.innerHTML = '';
    arr.forEach((item, index) => {
        let elItem = document.createElement('li');
        elItem.className = "flex items-center justify-between p-[8px] bg-blue-400 rounded-md";
        elItem.innerHTML = `
        <div class="flex space-x-[5px]">
            <span class="text-white text-[20px] font-black">${index + 1}.</span>
            <strong class="text-[20px] font-semibold text-white">${item.value}</strong>
        </div>
        <div>
            <button id=${item.id} class="delete-btn bg-red-500 p-2 rounded-md text-white mb-2">Delete</button>
            <button onclick={handleBtnClick(${item.id})} class="bg-green-500 p-2 rounded-md text-white mb-2">Update</button>
        </div>`;
        list.append(elItem);
        elItem.addEventListener("click", function (e) {
            if (e.target.matches(".delete-btn")) {
                console.log(e.target.id);
                // const data = todos.filter((item:TodoType) => item.id != Number((e.target as HTMLButtonElement).id))
                const findedIndex = todos.findIndex((item) => item.id == Number(e.target.id));
                todos.splice(findedIndex, 1);
                renderTodos([...todos], elTodoList);
                setState("todos", [...todos]);
            }
        });
    });
}
function handleBtnClick(id) {
    elModalWrapper === null || elModalWrapper === void 0 ? void 0 : elModalWrapper.classList.remove("scale-0");
    const selectedTodo = todos.find((item) => item.id === id);
    elModalInner.innerHTML = `
        <form class="update_form bg-white rounded-md mx-auto p-4">
            <h3 class="text-blue-500 font-semibold text-[30px] text-center mb-[8px]">Update</h3>
            <div class="flex justify-between w-full">
                <input type="text" value="${selectedTodo === null || selectedTodo === void 0 ? void 0 : selectedTodo.value}" 
                    class="update_input w-[75%] border-[2px] rounded-md p-[10px] outline-none text-blue-500 border-blue-400" placeholder="Typing...">
                <button type="submit" class="w-[28%] bg-blue-400 rounded-md text-white font-normal text-[20px]">Update</button>
            </div>
        </form>
    `;
    const updateForm = document.querySelector(".update_form");
    const updateInput = document.querySelector(".update_input");
    updateForm === null || updateForm === void 0 ? void 0 : updateForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const updatedValue = updateInput.value.trim();
        if (!updatedValue)
            return;
        todos = todos.map((todo) => {
            if (todo.id === id) {
                return Object.assign(Object.assign({}, todo), { value: updatedValue });
            }
            return todo;
        });
        setState("todos", todos);
        renderTodos(todos, elTodoList);
        elModalWrapper === null || elModalWrapper === void 0 ? void 0 : elModalWrapper.classList.add("scale-0");
    });
}
renderTodos(todos, elTodoList);
