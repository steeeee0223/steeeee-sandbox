import { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { Box, Container, Divider, List } from "@mui/material";

import { Drawer, DrawerHeader, DrawerList } from "@/components/sidebar";
import { FolderSystem, Toolbar } from "@/components/project";
import { useAppContext } from "@/contexts/app";
import { list1, list2, pathsWithoutSidebar } from "@/data";
import { useAppDispatch, useAppSelector, useAuth, usePath } from "@/hooks";
import { getDirectoryAsync } from "@/stores/directory";

const Sidebar = () => {
    const dispatch = useAppDispatch();
    const { sidebarOpen } = useAppContext();
    const { user } = useAuth();
    const { isLoading, currentProject } = useAppSelector(
        (state) => ({
            isLoading: state.directory.isLoading,
            currentProject: state.project.currentProject,
        }),
        shallowEqual
    );

    useEffect(() => {
        if (isLoading && user && currentProject)
            dispatch(
                getDirectoryAsync({
                    userId: user.uid,
                    projectId: currentProject.id,
                })
            );
    }, [isLoading, user, currentProject]);

    return (
        <Drawer
            variant="permanent"
            open={sidebarOpen}
            aria-label={currentProject?.id ?? undefined}
        >
            <DrawerHeader />
            {user && currentProject?.action === "edit" ? (
                <>
                    <Toolbar />
                    <Divider />
                    <FolderSystem parent="root" />
                </>
            ) : (
                <List>
                    <DrawerList open={sidebarOpen} listItems={list1} />
                    <Divider />
                    <DrawerList open={sidebarOpen} listItems={list2} />
                </List>
            )}
        </Drawer>
    );
};

export default function BasePage({ children }: { children: React.ReactNode }) {
    const {
        path: [, path],
    } = usePath();

    return (
        <Box sx={{ display: "flex" }}>
            {!pathsWithoutSidebar.includes(path) && <Sidebar />}
            <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                <DrawerHeader />
                <Container
                    sx={{
                        minHeight: "100vh",
                        width: "100%",
                        border: 0,
                        flexGrow: 1,
                    }}
                >
                    {children}
                </Container>
            </Box>
        </Box>
    );
}
