import { useForm } from "react-hook-form";
import {
    Divider,
    IconButton,
    InputBase,
    InputBaseProps,
    Paper,
    capitalize,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

import { useDirectory } from "@/hooks";
import { CreationType } from "@/types";
import { FormError } from "../common";

interface CreateFormProps {
    itemId: string;
    type: Exclude<CreationType, null>;
}

type CreateFormValues = { name: string; files: FileList };

export default function CreateForm({ itemId, type }: CreateFormProps) {
    const { isItemPresent, create } = useDirectory();
    const { register, handleSubmit, formState } = useForm<CreateFormValues>();
    const { errors } = formState;
    const title = capitalize(type);

    const inputSetups: InputBaseProps =
        type === "upload"
            ? {
                  type: "file",
                  componentsProps: { input: { multiple: true } },
                  ...register("files", {
                      validate: {
                          emptyList: (files: FileList) =>
                              files.length > 0 || `No files selected!`,
                      },
                  }),
              }
            : {
                  autoFocus: true,
                  placeholder: `Enter a ${type} name...`,
                  ...register("name", {
                      required: `${type} name is required!`,
                      validate: {
                          itemPresent: (name) =>
                              !isItemPresent(type, itemId, name) ||
                              `${title} ${name.trim()} already present`,
                          hasWhiteSpace: (name) =>
                              !!name.trim() || `Invalid ${type} name`,
                      },
                  }),
              };

    const onSubmit = ({ name, files }: CreateFormValues) =>
        type === "upload"
            ? Object.values(files).forEach((file) => {
                  console.log(file);
                  create("upload", file.name, file);
              })
            : create(type, name.trim());

    return (
        <>
            <Paper
                elevation={0}
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    p: "6px",
                    display: "flex",
                    alignItems: "center",
                    height: 30,
                    width: 400,
                }}
            >
                <InputBase
                    {...inputSetups}
                    size="small"
                    inputProps={{ "aria-label": type }}
                    sx={{ ml: 1, flex: 1, fontSize: "small" }}
                />
                <Divider sx={{ height: 20, m: 0.5 }} orientation="vertical" />
                <IconButton
                    type="submit"
                    sx={{ p: "3px", borderRadius: "2px" }}
                    aria-label={type}
                >
                    <AddBoxIcon fontSize="small" />
                </IconButton>
            </Paper>
            <FormError
                errors={errors}
                sx={{ width: "100%", fontSize: 12, alignItems: "center" }}
            />
        </>
    );
}
