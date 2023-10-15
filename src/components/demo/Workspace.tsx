import { Container } from "@mui/material";

import ControlledAccordion from "./Accordion";
import { useDirectory, useProjects } from "@/hooks";
import { Loading, Breadcrumbs } from "@/components/common";

const Workspace = () => {
    const { directoryIsLoading } = useProjects();
    const {
        currentItem: { path, item },
    } = useDirectory();

    return (
        <Container>
            {directoryIsLoading ? (
                <Loading />
            ) : (
                <>
                    <Breadcrumbs path={[...path.name, item.name]} />
                    <ControlledAccordion parent="root" />
                </>
            )}
        </Container>
    );
};

export default Workspace;
