'use client'

import StyledComponentsRegistry from '@/lib/registry'
import { GlobalStyles } from '@/styles/GlobalStyles'
import { ThemeProvider } from 'styled-components'
import { theme } from '@/styles/theme'
import SmoothScroll from './SmoothScroll'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <StyledComponentsRegistry>
            <ThemeProvider theme={theme}>
                <GlobalStyles />
                <SmoothScroll>
                    {children}
                </SmoothScroll>
            </ThemeProvider>
        </StyledComponentsRegistry>
    )
}
