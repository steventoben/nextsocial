import {useForm} from "react-hook-form";
import {FormControl, FormErrorMessage, FormLabel, Input} from "@chakra-ui/react";

interface FormField {
    name: string;
    label: string;
}

interface FormFields {
    [field: string]: FormField;
}

interface FormProps {}
export function Form(props: FormProps) {
    const {} = props;
    const {handleSubmit, register, formState: {errors}} = useForm();
    function onSubmit() {

    }
    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
                <FormLabel>

                </FormLabel>
                <Input/>
                <FormErrorMessage>

                </FormErrorMessage>
            </FormControl>
        </form>
    );
}
