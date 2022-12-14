import {
    ButtonGroup,
    Editable,
    EditableInput,
    EditablePreview, EditableTextarea,
    IconButton, Input,
    Tooltip, useColorModeValue,
    useEditableControls
} from "@chakra-ui/react";
import {CheckIcon, CloseIcon} from "@chakra-ui/icons";
import React, {ForwardedRef, SetStateAction} from "react";

interface Props {
    value?: string;
    setValue?: React.Dispatch<SetStateAction<string>>;
}

/* Here's a custom control */
function EditableControls() {
    const {
        isEditing,
        getSubmitButtonProps,
        getCancelButtonProps,
        getEditButtonProps
    } = useEditableControls();

    return isEditing ? (
        <ButtonGroup position={'absolute'} zIndex={9999} right={0} bottom={'-2rem'} justifyContent="end" size="sm" w="full" spacing={2} mt={2}>
            <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} aria-label={'edit'}/>
            <IconButton
                icon={<CloseIcon boxSize={3} />}
                {...getCancelButtonProps()}
                aria-label={'cancel'}
            />
        </ButtonGroup>
    ) : null;
}
export const LOREM_CONST = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tempus imperdiet faucibus. Curabitur at ligula ipsum. Sed enim ipsum, rhoncus ac interdum a, rutrum quis mi. Morbi quis porta mauris. Aliquam erat volutpat. Vivamus tincidunt non justo in placerat. Duis nulla est, vehicula non eros in, tempor auctor dolor. Integer vestibulum est ut nisl venenatis lobortis. Quisque bibendum ornare ultricies. Maecenas nec eros eu arcu sollicitudin varius. Sed a consectetur nunc. Nam blandit dolor ac diam semper consequat.`;
export const InlineTextbox = React.forwardRef(({value, setValue}: Props, ref: ForwardedRef<HTMLInputElement>) => {



    /*const handleChange = (newValue: string) => {
        setValue(newValue);
    }*/

    return (
        <Editable
            placeholder={`You don't have a bio yet. Share a bit about yourself!`}
            /*value={value}
            onChange={nextValue => setValue(nextValue)}*/
            defaultValue={value || LOREM_CONST}
            isPreviewFocusable={true}
            selectAllOnFocus={false}
            position={'relative'}
            marginBottom={'4rem'}
            width={'50ch'}
        >
            <Tooltip label="Click to edit">
                <EditablePreview
                    width={'100%'}
                    py={2}
                    px={4}
                    _hover={{
                        background: useColorModeValue("gray.100", "gray.700")
                    }}
                />
            </Tooltip>

            <Input width={'100%'} height={'20ex'} ref={ref} py={2} px={4} as={EditableTextarea} />
            <EditableControls />
        </Editable>
    );
});
InlineTextbox.displayName = 'InlineTextbox';
