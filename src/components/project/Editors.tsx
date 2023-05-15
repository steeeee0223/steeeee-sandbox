import { shallowEqual } from "react-redux";

import {
    useAppDispatch,
    useAppSelector,
    AppDispatch,
    RootState,
} from "@/hooks";
import { CodeEditor } from "@/components/common";
import Tabs, { TabInfo } from "../common/Tabs";
import { File } from "./FolderSystem";
import { selectItem } from "@/stores/files";
import { ProjectStorage } from "@/lib/projectStorage";

export default function Editors() {
    const { fileState } = useAppSelector(
        (state: RootState) => ({
            // user: state.auth.user,
            // isLoggedIn: state.auth.isAuthenticated,
            fileState: state.files,
        }),
        shallowEqual
    );
    const dispatch: AppDispatch = useAppDispatch();
    const project = new ProjectStorage(fileState);

    const children: TabInfo[] = project.currentEditors.map((id) => {
        const file = project.getFile(id) ?? (undefined as never);
        const { title, extension, content } = file as File;
        return {
            id,
            label: title,
            component: (
                <CodeEditor
                    name={title}
                    language={extension}
                    value={content}
                    readOnly={false}
                />
            ),
        };
    });

    const handleTabsChange = (value: string) => {
        // dispatch(selectItem())
    };

    return (
        <>
            {children.length > 0 && (
                <Tabs children={children} defaultValue={children[0].id} />
            )}
        </>
    );
}
