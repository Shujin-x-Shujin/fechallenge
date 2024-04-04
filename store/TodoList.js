import { defineStore } from "pinia";

export const useTodoListStore = defineStore("todoList", {
  state: () => ({
    list: [],
  }),
  actions: {
    addTodo(task) {
      this.list.push({
        task
      });
    },
    removeTodo(id) {
      const filteredList = this.list.records.filter((todo) => todo.id !== id);
      this.list = filteredList
    },
    sortTodoAsc() {
      this.list.records.sort((a, b) => {
        const taskA = a.task_name.toLowerCase();
        const taskB = b.task_name.toLowerCase();
        return taskA.localeCompare(taskB);
      });
    },
    sortTodoDesc() {
      this.list.records.sort((a, b) => {
        const taskA = a.task_name.toLowerCase();
        const taskB = b.task_name.toLowerCase();
        return taskB.localeCompare(taskA);
      });
    },
    sortTodoByCreatedAtAsc() {
      this.list.sort((a, b) => {
        return a.task.createdAt - b.task.createdAt
      });
    },
    sortTodoByCreatedAtDesc() {
      this.list.sort((a, b) => {
        return b.task.createdAt - a.task.createdAt
      });
    },
    updateList(list){
      this.list = list
    }
  }
});
