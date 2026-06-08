'use client'

import StyledComponentsRegistry from '@/lib/registry'
import { GlobalStyles } from '@/styles/GlobalStyles'
import { ThemeProvider } from 'styled-components'
import { theme } from '@/styles/theme'
import SmoothScroll from './SmoothScroll'
import { ModeProvider } from '@/contexts/mode-context'
import { LanguageProvider } from '@/contexts/language-context'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <StyledComponentsRegistry>
            <ThemeProvider theme={theme}>
                <GlobalStyles />
                <LanguageProvider>
                    <ModeProvider>
                        <SmoothScroll>
                            {children}
                        </SmoothScroll>
                    </ModeProvider>
                </LanguageProvider>
            </ThemeProvider>
        </StyledComponentsRegistry>
    )
}
