import { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { Box, Container, Divider, List } from "@mui/material";

import { Drawer, DrawerHeader, DrawerList } from "@/components/sidebar";
import { FolderSystem, Toolbar } from "@/components/project";
import { useAppContext } from "@/contexts/app";
import { list1, list2, pathsWithoutSidebar } from "@/data";
import { useAppDispatch, useAppSelector, useAuth, usePath } from "@/hooks";
import { getDirectoryAsync } from "@/stores/directory";

export default function BasePage({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const { sidebarOpen } = useAppContext();
    const {
        path: [, path],
    } = usePath();
    const { user } = useAuth();
    const { isLoading, currentProject } = useAppSelector(
        (state) => ({
            isLoading: state.directory.isLoading,
            currentProject: state.project.currentProject,
        }),
        shallowEqual
    );
    const isEditPage = currentProject?.action === "edit";

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
        <Box sx={{ display: "flex" }}>
            {!pathsWithoutSidebar.includes(path) && (
                <Drawer
                    variant="permanent"
                    open={sidebarOpen}
                    aria-label={currentProject?.id ?? undefined}
                >
                    <DrawerHeader />
                    {user && isEditPage ? (
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
            )}
            <Box
                component="main"
                sx={{ flexGrow: 1, ...(isEditPage && { px: 0 }) }}
            >
                <DrawerHeader />
                <Container
                    sx={{
                        minHeight: "100vh",
                        width: "100%",
                        border: 0,
                        flexGrow: 1,
                    }}
                    disableGutters={isEditPage}
                >
                    {children}
                </Container>
            </Box>
        </Box>
    );
}
