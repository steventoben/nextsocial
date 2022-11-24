import {Box, BoxProps, Button, Divider, Text, useOutsideClick} from "@chakra-ui/react";
import React from "react";
import {RiArrowDropDownFill} from "react-icons/ri";

type OptionType = {
    label: string;
    value: string;
};
export const sortOptions: OptionType[] = [
    {label: 'Recent', value: 'recent'},
    {label: 'Top', value: 'top'},
    {label: 'Trending', value: 'trending'},
];

function useToggle(defaultValue: boolean = false) {
    const [isOn, setIsOn] = React.useState<boolean>(defaultValue);
    const toggleIsOn = React.useCallback(() => setIsOn(v => !v), []);
    return [
        isOn,
        toggleIsOn
    ];
}

interface SortBySelectProps {
    options: OptionType[];
    boxProps?: BoxProps;
}
export function SortBySelect(props: SortBySelectProps) {
    const {
        options = sortOptions,
        boxProps
    } = props;
    const [selectedOption, setSelectedOption] = React.useState<OptionType>(options[0]);
    const [selectedValue, setSelectedValue] = React.useState<string>('');
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    //const toggleIsOpen = React.useCallback(() => setIsOpen(v => !v), []);

    function handleTriggerClick(_: React.MouseEvent<HTMLButtonElement>) {
        setIsOpen(v => !v);
    }
    useOutsideClick({
        ref: containerRef,
        handler: _ => {
            if(isOpen) {
                setIsOpen(false);
            }
        }
    })

    function handleOptionClick(option: OptionType) {
        setSelectedValue(option.value);
        setSelectedOption(option);
        setIsOpen(false);
    }


    return(
        <Box display={'inline-block'} position={'relative'} ref={containerRef} {...boxProps}>
            <Button variant={'unstyled'} onClick={handleTriggerClick}>
                <Box display={'inline-flex'} alignItems={'center'}>
                    <Text marginRight={'0.25rem'} fontWeight={400} as={'span'}>{`Sort by: `}</Text>
                    <Text fontWeight={600} as={'span'}>
                        {`${selectedOption.label}`}
                    </Text>
                    <RiArrowDropDownFill style={{transition: 'transform 100ms ease', transform: isOpen ? 'rotateZ(-180deg)' : 'rotateZ(0)'}} />
                </Box>
            </Button>
            {isOpen &&
            <Box borderRadius={'0.5rem'} boxShadow={'lg'} display={'block'} bg={'white'} zIndex={'dropdown'} position={'absolute'}>
                {options.map((option) => {
                    return (
                        <Box padding={'0.5rem 1rem'} _hover={{bg: 'primary.50'}} cursor={'pointer'} onClick={() => handleOptionClick(option)} key={option.value}>
                            {option.label}
                        </Box>
                    );
                })}
            </Box>}
        </Box>
    );
}

interface SelectProps {}
export function Select(props: SelectProps) {
    const {} = props;
    return(
        <div>
            Template
        </div>
    );
}
interface SortSelectProps {}
export function SortSelectDivider(props: SortSelectProps) {
    const {} = props;
    return(
        <Box display={'block'} marginBottom={'4rem'} position={'relative'}>
            <Divider/>
            <SortBySelect boxProps={{position: 'absolute', top: '-2.25rem', right: '1rem', padding: '1rem', bg: 'gray.50'}} options={sortOptions}/>
        </Box>
    );
}

