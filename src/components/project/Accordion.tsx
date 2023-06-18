import { styled } from "@mui/material/styles";
import {
    Accordion as MuiAccordion,
    AccordionProps,
    AccordionSummaryProps,
    AccordionSummary as MuiAccordionSummary,
    AccordionDetails as MuiAccordionDetails,
} from "@mui/material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";

export const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    "&:not(:last-child)": {
        borderBottom: 0,
    },
    "&:before": {
        display: "none",
    },
}));

export const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={
            <ArrowForwardIosSharpIcon
                sx={{ fontSize: "0.9rem" }}
                fontSize="small"
            />
        }
        {...props}
    />
))(({ theme }) => ({
    padding: "0 12px",
    backgroundColor: theme.palette.mode,
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
        transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
        margin: 0,
        marginLeft: theme.spacing(1),
    },
}));

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: 0,
    paddingLeft: theme.spacing(2),
}));
