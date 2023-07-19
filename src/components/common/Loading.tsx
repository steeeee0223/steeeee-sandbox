import { Skeleton } from "@mui/material";
import { DrawerHeader } from "../sidebar";

const Loading = () => {
    const rows = 5;
    return (
        <>
            <DrawerHeader />
            {Array(rows)
                .fill(null)
                .map((_, index) => (
                    <Skeleton
                        key={index}
                        animation="wave"
                        variant="rounded"
                        width="100%"
                        height={30}
                        sx={{ marginBottom: 3 }}
                    />
                ))}
        </>
    );
};

export default Loading;
