import { useRef } from "react";
import { Modal } from "@mui/material";
import { SandpackProvider } from "@codesandbox/sandpack-react";
import { Panel, PanelGroup } from "react-resizable-panels";

import { Loading, NotFound, PanelDivider } from "@/components/common";
import { Editors, Viewer, RenameForm, Viewer2 } from "@/components/project";
import { usePath, useProjects, useDirectory } from "@/hooks";

export default function Project() {
    const {
        path: [, , projectId],
    } = usePath();
    const { projectIsLoading, isProjectOfUser } = useProjects();
    const { bundledFiles, project, action, updateAction } = useDirectory();
    const formRef = useRef();
    const handleFormClose = () => updateAction({ rename: null });

    return projectIsLoading ? (
        <Loading />
    ) : isProjectOfUser(projectId) ? (
        <SandpackProvider
            template={project.template}
            // customSetup={sampleSetup}
            files={bundledFiles}
        >
            <PanelGroup direction="horizontal" units="percentages">
                <Panel
                    // collapsedSize={5}
                    // collapsible={true}
                    // minSize={10}
                    minSize={30}
                    defaultSize={50}
                >
                    <Editors />
                </Panel>
                <PanelDivider direction="vertical" />
                <Panel defaultSize={50} minSize={20}>
                    <PanelGroup direction="vertical" units="percentages">
                        <Panel defaultSize={50} minSize={20}>
                            <Viewer />
                        </Panel>
                        <PanelDivider direction="horizontal" />
                        <Panel defaultSize={50} minSize={20}>
                            <Viewer2 />
                        </Panel>
                    </PanelGroup>
                </Panel>
            </PanelGroup>

            <Modal open={!!action.rename?.itemId} onClose={handleFormClose}>
                <RenameForm ref={formRef} />
            </Modal>
        </SandpackProvider>
    ) : (
        <NotFound message="Project Not Found" />
    );
}
