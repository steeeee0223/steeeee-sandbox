import { Skeleton } from "@mui/material";

const Loading = () => {
    const rows = 5;
    return (
        <>
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
