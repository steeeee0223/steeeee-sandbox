import { useEffect } from "react";
import { Box, Divider, List } from "@mui/material";

import { Drawer, DrawerHeader, DrawerList } from "@/components/sidebar";
import { FolderSystem, Toolbar } from "@/components/project";
import { useAppContext } from "@/contexts/app";
import { list1, list2 } from "@/data";
import { useAppDispatch, usePath, useProjects } from "@/hooks";
import { getDirectoryAsync } from "@/stores/directory";
import { containerHeight } from "@/theme";

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
        <Box sx={{ width: "100%", display: "flex" }}>
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
                sx={{
                    flexGrow: 1,
                    width: "100%",
                    maxHeight: containerHeight,
                    px: isValidEditPage || isHomePage ? 0 : 4,
                }}
            >
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
}
