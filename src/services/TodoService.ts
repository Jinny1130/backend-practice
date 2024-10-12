import { client, connect, disconnect } from '@/models/mongodb';
import { ObjectId } from 'mongodb';
import NotFoundError from '@/errors/NotFoundError';

const dbName = 'todo-app';
const collectionName = 'todos';

// _id를 id로 변환하는 함수 추가
function transformId(doc: any) {
    if (doc._id) {
        doc.id = doc._id.toString();
        delete doc._id;
    }
    return doc;
}

// CRUD 중 Read 
export async function getTodos(id?: string | null) {
    try {
        await connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        if (id) {
            // 단건 조회
            const todo = await collection.findOne({ _id: new ObjectId(id) });
            if (todo) {
                return transformId(todo);
            } else {
                throw new NotFoundError('할 일을 찾을 수 없습니다.');
            }
        }

        // 다건 조회
        const todos = await collection.find({}).toArray();
        return todos.map(transformId);
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        } else {
            throw new Error('서버 오류가 발생했습니다.');
        }
    } finally {
        await disconnect();
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