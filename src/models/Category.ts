export class BaseCategory {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly parentId: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly deleted = false
    ){
    }
}

export class Category extends BaseCategory {
    constructor(
        id: string,
        name: string,
        public readonly parent: Category | null,
        createdAt: Date,
        updatedAt: Date,
        deleted = false
    ){
        super(id, name, parent?.id ?? null, createdAt, updatedAt, deleted);
    }
}

export class CategoryTreeEntry extends BaseCategory {
    public readonly children: Array<CategoryTreeEntry> = [];
}

export type CategoryTree = Array<CategoryTreeEntry>