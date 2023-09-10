import { useEffect } from "react";
import { Box, Container, Divider, List } from "@mui/material";

import { Drawer, DrawerHeader, DrawerList } from "@/components/sidebar";
import { FolderSystem, Toolbar } from "@/components/project";
import { useAppContext } from "@/contexts/app";
import { list1, list2 } from "@/data";
import { useAppDispatch, usePath, useProjects } from "@/hooks";
import { getDirectoryAsync } from "@/stores/directory";

export default function BasePage({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const { sidebarOpen } = useAppContext();
    const {
        isPageWithSidebar,
        isHomePage,
        path: [, path, id],
    } = usePath();
    const { isProjectOfUser, user, currentProject, directoryIsLoading } =
        useProjects();
    const isValidEditPage = !!user && path === "project" && isProjectOfUser(id);

    useEffect(() => {
        if (directoryIsLoading && user && currentProject)
            dispatch(
                getDirectoryAsync({
                    userId: user.uid,
                    projectId: currentProject.id,
                })
            );
    }, [directoryIsLoading, user, currentProject]);

    return (
        <Box sx={{ display: "flex" }}>
            {isPageWithSidebar && (
                <Drawer variant="permanent" open={sidebarOpen} aria-label={id}>
                    <DrawerHeader />
                    {isValidEditPage ? (
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
                sx={{ flexGrow: 1, ...(isValidEditPage && { px: 0 }) }}
            >
                <DrawerHeader />
                <Container
                    sx={{
                        minHeight: "100vh",
                        minWidth: "100%",
                        border: 0,
                        flexGrow: 1,
                        marginX: 0,
                    }}
                    disableGutters={isValidEditPage || isHomePage}
                >
                    {children}
                </Container>
            </Box>
        </Box>
    );
}
