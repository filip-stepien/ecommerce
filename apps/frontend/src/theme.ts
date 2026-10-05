import { Button, Container, InputWrapper, createTheme } from '@mantine/core';

export const theme = createTheme({
    primaryColor: 'blue',
    primaryShade: 8,
    black: '#17212f',
    defaultRadius: 'sm',
    fontFamily: "'Open Sans Variable', sans-serif",
    components: {
        Button: Button.extend({
            defaultProps: { color: 'blue.5' }
        }),
        Container: Container.extend({
            classNames: { root: 'max-w-[1440px] px-4 md:px-16' }
        }),
        InputWrapper: InputWrapper.extend({
            classNames: { label: 'font-semibold' }
        })
    }
});
