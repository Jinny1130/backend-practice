'use client'

import React, { useState } from 'react';

interface Todo {
	id: number;
	text: string;
}

const TodoList: React.FC = () => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [input, setInput] = useState('');

	const addTodo = () => {
		if (input.trim() !== '') {
			setTodos([...todos, { id: Date.now(), text: input.trim() }]);
			setInput('');
		}
	};

	const updateTodo = (id: number, newText: string) => {
		setTodos(todos.map(todo => todo.id === id ? { ...todo, text: newText } : todo));
	};

	const deleteTodo = (id: number) => {
		setTodos(todos.filter(todo => todo.id !== id));
	};

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">할 일 목록</h1>
			<div className="flex mb-4">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="flex-grow p-2 border rounded-l"
					placeholder="새로운 할 일을 입력하세요"
				/>
				<button onClick={addTodo} className="bg-blue-500 text-white p-2 rounded-r">추가</button>
			</div>
			<ul>
				{todos.map(todo => (
					<li key={todo.id} className="flex items-center mb-2">
						<input
							type="text"
							value={todo.text}
							onChange={(e) => updateTodo(todo.id, e.target.value)}
							className="flex-grow p-2 border rounded mr-2"
						/>
						<button onClick={() => deleteTodo(todo.id)} className="bg-red-500 text-white p-2 rounded">삭제</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TodoList;