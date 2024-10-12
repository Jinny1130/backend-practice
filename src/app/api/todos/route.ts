import { NextResponse } from 'next/server';
import { getTodos } from '@/services/TodoService';
import NotFoundError from '@/errors/NotFoundError';

// CRUD 중 Read 
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        const todos = await getTodos(id);
        return NextResponse.json(todos);
    } catch (error) {
        console.error('Todo 정보 조회 중 오류 발생: ', error);
        if (error instanceof NotFoundError) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        } else if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}

// // CRUD 중 Create
// export async function POST(request: Request) {
//     try {
//         const todo = await request.json();
//         await connect();
//         const db = client.db(dbName);
//         const collection = db.collection(collectionName);

//         const result = await collection.insertOne(todo);
//         const newTodo = await collection.findOne({ _id: result.insertedId });
//         return NextResponse.json(transformId(newTodo), { status: 201 });
//     } catch (error) {
//         console.error('MongoDB 생성 중 오류 발생:', error);
//         return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
//     } finally {
//         await disconnect();
//     }
// }

// // CRUD 중 Update
// export async function PUT(request: Request) {
//     try {
//         const { id, ...updateData } = await request.json();
//         await connect();
//         const db = client.db(dbName);
//         const collection = db.collection(collectionName);

//         const result = await collection.findOneAndUpdate(
//             { _id: new ObjectId(id) },
//             { $set: updateData },
//             { returnDocument: 'after' }
//         );

//         if (result) {
//             return NextResponse.json(transformId(result), { status: 200 });
//         }
//         return NextResponse.json({ error: '할 일을 찾을 수 없습니다.' }, { status: 404 });
//     } catch (error) {
//         console.error('MongoDB 업데이트 중 오류 발생:', error);
//         return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
//     } finally {
//         await disconnect();
//     }
// }

// // CRUD 중 Delete
// export async function DELETE(request: Request) {
//     try {
//         const { id } = await request.json();
//         await connect();
//         const db = client.db(dbName);
//         const collection = db.collection(collectionName);

//         const result = await collection.findOneAndDelete({ _id: new ObjectId(id) });

//         if (result) {
//             return NextResponse.json({ message: '할 일이 삭제되었습니다.' }, { status: 200 });
//         }
//         return NextResponse.json({ error: '할 일을 찾을 수 없습니다.' }, { status: 404 });
//     } catch (error) {
//         console.error('MongoDB 삭제 중 오류 발생:', error);
//         return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
//     } finally {
//         await disconnect();
//     }
// }

// REST Full API 생성 = 표현력이 있는 API 를 만들 수 있게 메소드를 국제기관에서 만들어줌
// GET(조회) POST(생성) PUT(수정) DELETE(삭제)