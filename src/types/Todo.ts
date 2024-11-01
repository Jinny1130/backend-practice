export type Todo = {
    id: Id;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export type Id = string;