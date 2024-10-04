import { NextResponse } from 'next/server';

const API_URL = 'http://localhost:3001/todos';

// CRUD 중 Read 
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // (단건 조회)
    if (id) {
        // const todo = todos.find(todo => todo.id === parseInt(id));
        // if (todo) {
        const response = await fetch(`${API_URL}?id=${id}`);
        if (response.ok) {
            const todo = await response.json();
            return NextResponse.json(todo[0]);
        } else {
            return NextResponse.json({ error: '할 일을 찾을 수 없습니다.' }, { status: 404 });
        }
    }
    
    // (다건 조회 eg. 목록)
    const response = await fetch(API_URL);
    const todos = await response.json();
    return NextResponse.json(todos);
}

// CRUD 중 Create
export async function POST(request: Request) {
    // const { text } = await request.json();
    // const newTodo = { id: ++currentId, text };
    // todos.push(newTodo);
    const todo = await request.json();
    const todoWithId = {
        id: Date.now(),
        ...todo
    }
    const response = await fetch(API_URL, {
        method: 'POST',
        headers:  {'Content-Type': 'application/json'},
        body: JSON.stringify(todoWithId),
    });
    const newTodo = await response.json();

    return NextResponse.json(newTodo, { status: 201 });
}

// CUD 중 Update
export async function PUT(request: Request) {
    // const { id, text } = await request.json();
    // const todoIndex = todos.findIndex(todo => todo.id === id);
    // if (todoIndex !== -1) {
    //     todos[todoIndex].text = text;
    //    return NextResponse.json(todos[todoIndex], { status: 200 });
    const { id, ...updateData } = await request.json();
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers:  {'Content-Type': 'application/json'},
        body: JSON.stringify(updateData)
    });
    if (response.ok) {
        const updatedTodo = await response.json();
        return NextResponse.json(updatedTodo, { status: 200 });
    }
    return NextResponse.json({ error: '할 일을 찾을 수 없습니다.' }, { status: 404 });
}

// CRUD 중 Delete
export async function DELETE(request: Request) {
    const { id } = await request.json();
    // const todoIndex = todos.findIndex(todo => todo.id === id);
    // if (todoIndex !== -1) {
    //     const deletedTodo = todos.splice(todoIndex, 1)[0];
    //     return NextResponse.json(deletedTodo, { status: 200 });
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        return NextResponse.json({ message: '할 일이 삭제되었습니다.' }, { status: 200 });
    }
    return NextResponse.json({ error: '할 일을 찾을 수 없습니다.' }, { status: 404 });
}

// REST Full API 생성 = 표현력이 있는 API 를 만들 수 있게 메소드를 국제기관에서 만들어줌
// GET(조회) POST(생성) PUT(수정) DELET(삭제)