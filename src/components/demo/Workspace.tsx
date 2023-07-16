import { Container } from "@mui/material";

import ControlledAccordion from "./Accordion";
import Breadcrumbs from "./Breadcrumbs";
import { useProjects } from "@/hooks";
import { Loading } from "@/components/common";

const Workspace = () => {
    const { directoryIsLoading } = useProjects();

    return (
        <Container>
            {directoryIsLoading ? (
                <Loading />
            ) : (
                <>
                    <Breadcrumbs />
                    <ControlledAccordion parent="root" />
                </>
            )}
        </Container>
    );
};

export default Workspace;
