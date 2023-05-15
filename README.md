# My Code Sandbox

### Firebase

-   Collection: `folders`

```typescript
interface Item {
    name: string;
    parent: string; // <directoryId>
    createdAt: number; // <timestamp>
    updatedAt: number; // <timestamp>
    lastAccessed: number; // <timestamp>
    createdBy: string; // <ID>
    userId: string; // <ID>
}

interface Directory extends Item {
    // name: string; // "Test Folder"
    path: Array;
}
```

-   Collection: `files`

```typescript
interface File extends Item {
    // name: string; // "Test File"

    content: string; // file content
    extension: string; // "txt"
    url: string;
    path: Array;
}
```
