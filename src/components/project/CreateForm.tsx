import { Validate, useForm } from "react-hook-form";
import {
    Alert,
    Divider,
    IconButton,
    InputBase,
    InputBaseProps,
    Paper,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import BlockIcon from "@mui/icons-material/Block";

import { useDirectory } from "@/hooks";
import { CreationType } from "@/stores/cursor";

interface CreateFormProps {
    itemId: string;
    type: Exclude<CreationType, null>;
}

type CreateFormValues = { name: string; files: FileList };

export default function CreateForm({ itemId, type }: CreateFormProps) {
    const { isFilePresent, isFolderPresent, createItem } = useDirectory();
    const { register, handleSubmit, formState } = useForm<CreateFormValues>();
    const { errors } = formState;

    const validations: Record<
        Exclude<CreationType, null>,
        Validate<any, CreateFormValues>
    > = {
        file: (name: string) =>
            !isFilePresent(itemId, name.trim()) ||
            `File ${name.trim()} already present!`,
        folder: (name: string) =>
            !isFolderPresent(itemId, name.trim()) ||
            `Folder ${name.trim()} already present!`,
        upload: (files: FileList) => files.length > 0 || `No files selected!`,
    };

    const inputSetups: InputBaseProps =
        type === "upload"
            ? {
                  type: "file",
                  componentsProps: {
                      input: { multiple: true },
                  },
                  ...register("files", {
                      validate: { emptyList: validations[type] },
                  }),
              }
            : {
                  autoFocus: true,
                  placeholder: `Enter a ${type} name...`,
                  ...register("name", {
                      required: `${type} name is required!`,
                      validate: {
                          itemPresent: validations[type],
                          hasWhiteSpace: (name) =>
                              !!name.trim() || `Invalid ${type} name`,
                      },
                  }),
              };

    const onSubmit = ({ name, files }: CreateFormValues) =>
        type === "upload"
            ? Object.values(files).forEach((file) => {
                  console.log(file);
                  createItem("upload", file.name, file);
              })
            : createItem(type, name.trim());

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
            {errors.name && (
                <Alert
                    icon={<BlockIcon />}
                    severity="error"
                    sx={{ width: 400, fontSize: 12, alignItems: "center" }}
                >
                    {errors.name.message}
                </Alert>
            )}
            {errors.files && (
                <Alert
                    icon={<BlockIcon />}
                    severity="error"
                    sx={{ width: 400, fontSize: 12, alignItems: "center" }}
                >
                    {errors.files.message}
                </Alert>
            )}
        </>
    );
}
