type BaseItem = {
    parent: string;
    itemId: string;
    isFolder: boolean;
    title: string;
    subtitle?: string;
    desc?: string;
};

export type Folder = BaseItem & {
    isFolder: true;
    children?: DirectoryItem[];
};

export type File = BaseItem & {
    isFolder: false;
    extension: string;
    content: string;
};

export type DirectoryItem = Folder | File;

export type SelectedItem = {
    item: { id: string; name: string; isFolder: boolean };
    path: { id: string[]; name: string[] };
};
