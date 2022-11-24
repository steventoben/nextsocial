import {FormControl} from "@chakra-ui/react";
import {useForm} from "react-hook-form";

interface TextFieldProps {}
export function TextField(props: TextFieldProps) {
    const {} = props;
    const {handleSubmit, register, formState: {errors}} = useForm();
    return(
        <FormControl>
            Template
        </FormControl>
    );
}
