import { ReactNode } from "react";
import { Card, CardContent, CardMedia, CardProps } from "@mui/material";

interface ImageCardProps extends CardProps {
    image: { src?: string; alt?: string; height?: string; width?: string };
    children?: ReactNode;
}

export default function ImageCard({
    image,
    children,
    ...props
}: ImageCardProps) {
    return (
        <Card {...props}>
            <CardMedia component="img" {...image} />
            <CardContent>{children}</CardContent>
        </Card>
    );
}
