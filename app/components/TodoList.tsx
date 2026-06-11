"use client";

import { useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const TodoList = ({ initialTodos }: { initialTodos: Todo[] }) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [title, setTitle] = useState("");

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  
  const addTodo = async () => {
    if (!title.trim()) return;

    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    fetchTodos();
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      )
    );

    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
  };


  const deleteTodo = async (id: number) => {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });

    fetchTodos();
  };
  return (
    <div>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="新しいTodoを入力"
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded                                
  hover:bg-blue-600">追加</button>
      </div>
      <ul className="space-y-3">                                                                                                                      
          {todos.map((todo) => (                                                                                                  
            <li key={todo.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded">                                                                                                    
              <input
                type="checkbox"                                                                                                   
                checked={todo.completed}                                                                                          
                onChange={() => toggleTodo(todo.id, todo.completed)}                                                              
              />                                                                                                                
              <span className="flex-1">{todo.title}</span>
              <button onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:text-red-700">削除</button>
            </li>                         
          ))}
        </ul> 

    </div>
  );

};



export default TodoList; 