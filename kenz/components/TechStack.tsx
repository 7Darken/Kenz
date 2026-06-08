'use client'

import styled, { keyframes } from 'styled-components'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { Send } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from '@/contexts/language-context'

/* ── Types (content comes from the i18n dictionary) ── */

type Msg = {
  role: 'kenz' | 'visitor'
  text: string
  tags?: string[]
  cta?: boolean
}

type Suggestion = { label: string; question: string; response: Msg }

const OPEN_CONTACT_EVENT = 'open-contact-modal'

/* ── Typing hook ── */

function useTypingEffect(text: string, speed: number = 18, enabled: boolean = true) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!enabled) { setDisplayed(text); setDone(true); return }
    setDisplayed(''); setDone(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(interval); setDone(true) }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, enabled])

  return { displayed, done }
}

/* ── Styles ── */

const Section = styled.section`
  padding: 5rem 2rem;

  @media (max-width: 768px) { padding: 3rem 1rem; }
`

const Inner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`

const SectionLabel = styled(motion.span)`
  font-family: ${p => p.theme.fonts.mono};
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  display: block;
  margin-bottom: 0.8rem;
`

const SectionTitle = styled(motion.h2)`
  font-family: ${p => p.theme.fonts.aesthetic};
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 2.5rem;
`

const ChatWindow = styled(motion.div)`
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const ChatHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: 0.8rem;
`

const ChatAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
`

const ChatHeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`

const ChatHeaderName = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
`

const ChatHeaderStatus = styled.span`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  gap: 0.4rem;
`

const OnlineDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00ff88;
`

const ChatBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 420px;
  overflow-y: auto;
  overscroll-behavior: contain;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
`

const MessageRow = styled(motion.div)<{ $isKenz: boolean }>`
  display: flex;
  gap: 0.7rem;
  align-items: flex-start;
  align-self: ${p => p.$isKenz ? 'flex-start' : 'flex-end'};
  flex-direction: ${p => p.$isKenz ? 'row' : 'row-reverse'};
  max-width: 85%;
`

const MsgAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  margin-top: 2px;
  img { width: 100%; height: 100%; object-fit: cover; }
`

const MsgBubble = styled.div<{ $isKenz: boolean }>`
  padding: 0.8rem 1rem;
  border-radius: ${p => p.$isKenz ? '4px 16px 16px 16px' : '16px 4px 16px 16px'};
  background: ${p => p.$isKenz ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 200, 160, 0.12)'};
  border: 1px solid ${p => p.$isKenz ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 200, 160, 0.2)'};
  font-size: 0.88rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 350;
`

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1em;
  background: rgba(255, 255, 255, 0.6);
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: ${blink} 0.8s step-end infinite;
`

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.5rem;
`

const Tag = styled.span`
  font-family: ${p => p.theme.fonts.mono};
  font-size: 0.65rem;
  padding: 0.25rem 0.6rem;
  border-radius: 100px;
  background: rgba(0, 200, 160, 0.1);
  border: 1px solid rgba(0, 200, 160, 0.15);
  color: #00c8a0;
  letter-spacing: 0.02em;
`

const CtaButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.5rem;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  border: none;
  background: #fff;
  color: #000;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;

  &:hover {
    background: rgba(255, 255, 255, 0.85);
  }

  svg { width: 12px; height: 12px; }
`

const dotsAnim = keyframes`
  0%, 20% { content: ''; }
  40% { content: '.'; }
  60% { content: '..'; }
  80%, 100% { content: '...'; }
`

const TypingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  align-self: flex-start;

  span {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.3);
    font-style: italic;
    &::after { content: ''; animation: ${dotsAnim} 1.2s infinite; }
  }
`

/* ── Suggestion pills ── */

const SuggestionsRow = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-self: flex-end;
  max-width: 85%;
  justify-content: flex-end;
`

const SuggestionPill = styled(motion.button)`
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  border-radius: 100px;
  background: rgba(0, 200, 160, 0.08);
  border: 1px solid rgba(0, 200, 160, 0.18);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(0, 200, 160, 0.15);
    border-color: rgba(0, 200, 160, 0.35);
    color: #fff;
  }
`

/* ── Input ── */

const ChatInputArea = styled.form`
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  gap: 0.8rem;
  align-items: center;
`

const ChatInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 0.7rem 1rem;
  color: #fff;
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.3s ease;
  &::placeholder { color: rgba(255, 255, 255, 0.25); }
  &:focus { border-color: rgba(0, 200, 160, 0.3); }
`

const SendBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: none;
  background: #00c8a0;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  &:hover { background: #00ddb0; transform: translateY(-1px); }
  &:disabled { opacity: 0.3; cursor: default; transform: none; }
  svg { width: 16px; height: 16px; }
`

/* ── Message component ── */

function ChatMessage({ msg, shouldAnimate, onDone }: {
  msg: Msg
  shouldAnimate: boolean
  onDone?: () => void
}) {
  const t = useTranslation()
  const isKenz = msg.role === 'kenz'
  const { displayed, done } = useTypingEffect(msg.text, isKenz ? 18 : 8, shouldAnimate)

  useEffect(() => {
    if (done && onDone) onDone()
  }, [done, onDone])

  return (
    <MessageRow
      $isKenz={isKenz}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isKenz && (
        <MsgAvatar>
          <Image src="/images/Pro-pp.webp" alt="Kenz" width={28} height={28} />
        </MsgAvatar>
      )}
      <div>
        <MsgBubble $isKenz={isKenz}>
          {displayed}
          {!done && <Cursor />}
          {isKenz && msg.cta && done && (
            <CtaButton onClick={() => window.dispatchEvent(new Event(OPEN_CONTACT_EVENT))}>
              <Send size={13} />
              {t.techStack.contactCta}
            </CtaButton>
          )}
        </MsgBubble>
        {isKenz && msg.tags && msg.tags.length > 0 && done && (
          <TagsRow>
            {msg.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
          </TagsRow>
        )}
      </div>
    </MessageRow>
  )
}

/* ── Main ── */

export default function TechStack() {
  const ref = useRef(null)
  const chatBodyRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const t = useTranslation()

  // Conversation content, built from the active-language dictionary.
  const firstExchange = useMemo<Msg[]>(() => [
    { role: 'visitor', text: t.techStack.intro.question },
    { role: 'kenz', text: t.techStack.intro.answer, tags: t.techStack.intro.tags },
  ], [t])

  const suggestions = useMemo<Suggestion[]>(() => t.techStack.suggestions.map(s => ({
    label: s.label,
    question: s.question,
    response: { role: 'kenz', text: s.answer, tags: s.tags },
  })), [t])

  const autoResponses = useMemo(() => t.techStack.autoResponses.map(r => ({
    keywords: r.keywords,
    response: {
      role: 'kenz' as const,
      text: r.answer,
      tags: r.tags.length ? r.tags : undefined,
    },
  })), [t])

  const defaultResponse = useMemo<Msg>(() => ({
    role: 'kenz',
    text: t.techStack.defaultAnswer,
    tags: t.techStack.defaultTags,
    cta: true,
  }), [t])

  const [messages, setMessages] = useState<Msg[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [input, setInput] = useState('')
  const [introPhase, setIntroPhase] = useState<'idle' | 'playing' | 'done'>('idle')
  const [usedSuggestions, setUsedSuggestions] = useState<Set<number>>(new Set())
  const [lastAnimated, setLastAnimated] = useState(-1)

  const remainingSuggestions = suggestions.filter((_, i) => !usedSuggestions.has(i))
  const allSuggestionsUsed = usedSuggestions.size >= suggestions.length

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, isTyping, scrollToBottom])

  // Auto-play first exchange
  useEffect(() => {
    if (!inView || introPhase !== 'idle') return
    setIntroPhase('playing')

    // Show visitor question
    setTimeout(() => {
      setMessages([firstExchange[0]])
      setLastAnimated(0)

      // Then Kenz types
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setMessages([firstExchange[0], firstExchange[1]])
          setLastAnimated(1)
          setIntroPhase('done')
        }, 800)
      }, 600)
    }, 500)
  }, [inView, introPhase, firstExchange])

  const addExchange = useCallback((question: string, response: Msg) => {
    if (isTyping) return
    const userMsg: Msg = { role: 'visitor', text: question }
    setMessages(prev => {
      setLastAnimated(prev.length)
      return [...prev, userMsg]
    })

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => {
        setLastAnimated(prev.length)
        return [...prev, response]
      })
    }, 600 + response.text.length * 6)
  }, [isTyping])

  const handleSuggestion = useCallback((index: number) => {
    const s = suggestions[index]
    setUsedSuggestions(prev => new Set(prev).add(index))
    addExchange(s.question, s.response)
  }, [addExchange, suggestions])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const lower = input.toLowerCase()
    const match = autoResponses.find(r => r.keywords.some(k => lower.includes(k)))
    addExchange(input.trim(), match?.response || defaultResponse)
    setInput('')
  }

  return (
    <Section id="kenz-ai" ref={ref}>
      <Inner>
        <SectionLabel
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {t.techStack.label}
        </SectionLabel>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {t.techStack.title}
        </SectionTitle>

        <ChatWindow
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChatHeader>
            <ChatAvatar>
              <Image src="/images/Pro-pp.webp" alt="Kenz" width={32} height={32} />
            </ChatAvatar>
            <ChatHeaderInfo>
              <ChatHeaderName>{t.techStack.name}</ChatHeaderName>
              <ChatHeaderStatus><OnlineDot />{t.techStack.online}</ChatHeaderStatus>
            </ChatHeaderInfo>
          </ChatHeader>

          <ChatBody ref={chatBodyRef}>
            <AnimatePresence>
              {messages.map((msg, i) => (
                <ChatMessage
                  key={i}
                  msg={msg}
                  shouldAnimate={i >= lastAnimated}
                  onDone={scrollToBottom}
                />
              ))}
            </AnimatePresence>

            {isTyping && (
              <TypingIndicator initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <MsgAvatar>
                  <Image src="/images/Pro-pp.webp" alt="Kenz" width={28} height={28} />
                </MsgAvatar>
                <span>{t.techStack.typing}</span>
              </TypingIndicator>
            )}

            {/* Suggestion pills */}
            {introPhase === 'done' && !isTyping && remainingSuggestions.length > 0 && (
              <SuggestionsRow
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {suggestions.map((s, i) =>
                  !usedSuggestions.has(i) && (
                    <SuggestionPill
                      key={i}
                      onClick={() => handleSuggestion(i)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {s.label}
                    </SuggestionPill>
                  )
                )}
              </SuggestionsRow>
            )}
          </ChatBody>

          <ChatInputArea onSubmit={handleSend}>
            <ChatInput
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={allSuggestionsUsed ? t.techStack.placeholderAsk : t.techStack.placeholderDefault}
              disabled={introPhase !== 'done'}
            />
            <SendBtn type="submit" disabled={!input.trim() || isTyping || introPhase !== 'done'}>
              <Send />
            </SendBtn>
          </ChatInputArea>
        </ChatWindow>
      </Inner>
    </Section>
  )
}
