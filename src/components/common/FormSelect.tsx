import { Controller } from "react-hook-form";
import {
    FormControl,
    FormControlProps,
    InputLabel,
    MenuItem,
    Select,
    SelectProps,
} from "@mui/material";

interface SelectOption {
    value: string;
    label: string;
}

interface FormSelectProps {
    name: string;
    control: any;
    label: string;
    setValue?: any;
    options: SelectOption[];
    FormControlProps?: FormControlProps;
    SelectProps?: SelectProps;
}

export default function FormSelect({
    name,
    control,
    label,
    options,
    FormControlProps,
    SelectProps,
}: FormSelectProps) {
    const generateSingleOptions = () => {
        return options.map(({ value, label }: SelectOption) => (
            <MenuItem key={value} value={value}>
                {label}
            </MenuItem>
        ));
    };
    return (
        <FormControl {...FormControlProps}>
            <InputLabel>{label}</InputLabel>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <Select onChange={onChange} value={value} {...SelectProps}>
                        {generateSingleOptions()}
                    </Select>
                )}
            />
        </FormControl>
    );
}
