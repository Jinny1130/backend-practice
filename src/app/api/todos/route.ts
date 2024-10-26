import { NextResponse } from 'next/server';
import { getTodos, addTodo, modifyTodo, deleteTodo } from '@/services/TodoService';
import NotFoundError from '@/errors/NotFoundError';

// CRUD 중 Read 
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        const todos = await getTodos(id);
        return NextResponse.json(todos);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        } else if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}

//  CRUD 중 Create
export async function POST(request: Request) {
    const todo = await request.json();
    
    try {
        const newTodo = await addTodo(todo);
        return NextResponse.json(newTodo);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}

// CRUD 중 Update
export async function PUT(request: Request) {
    const todo = await request.json();
    try {
        const updatedTodo = await modifyTodo(todo);
        return NextResponse.json(updatedTodo);

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}

// CRUD 중 Delete
export async function DELETE(request: Request) {
    const todo = await request.json();
    try {
        const deleted = await deleteTodo(todo);
        return NextResponse.json(deleted);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}

// REST Full API 생성 = 표현력이 있는 API 를 만들 수 있게 메소드를 국제기관에서 만들어줌
// GET(조회) POST(생성) PUT(수정) DELETE(삭제)