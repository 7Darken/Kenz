'use client'

import styled from 'styled-components'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowUpRight, Mail, Github, Linkedin, X, Send } from 'lucide-react'
import { useTranslation } from '@/contexts/language-context'

/* ── Styles ── */

const Section = styled.section`
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`

const Inner = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 2;
`

const Glow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 200, 160, 0.08) 0%, transparent 60%);
  filter: blur(80px);
  pointer-events: none;
`

const Label = styled(motion.span)`
  font-family: ${p => p.theme.fonts.mono};
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
`

const Title = styled(motion.h2)`
  font-family: ${p => p.theme.fonts.aesthetic};
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.1;
  color: #fff;
`

const Subtitle = styled(motion.p)`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.6;
  max-width: 480px;
  font-weight: 300;
`

const ContactButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2.2rem;
  border-radius: 100px;
  background: #fff;
  color: #000;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.1);

  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 0 60px rgba(255, 255, 255, 0.15);
    svg { transform: translate(2px, -2px); }
  }
`

const LinksRow = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-2px);
  }

  svg { width: 18px; height: 18px; }
`

const Availability = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 0.5rem;
`

const GreenDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00ff88;
  box-shadow: 0 0 8px #00ff88;
`

/* ── Modal ── */

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`

const Modal = styled(motion.div)`
  width: 100%;
  max-width: 480px;
  background: #0a0a0c;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 2.5rem;
  position: relative;

  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
  }
`

const ModalClose = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }

  svg { width: 16px; height: 16px; }
`

const ModalTitle = styled.h3`
  font-family: ${p => p.theme.fonts.aesthetic};
  font-size: 1.8rem;
  font-weight: 400;
  font-style: italic;
  color: #fff;
  margin-bottom: 0.5rem;
`

const ModalSubtitle = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 2rem;
  line-height: 1.5;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const InputLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 0.3rem;
  display: block;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const Input = styled.input`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 0.85rem 1rem;
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.3s ease;

  &::placeholder { color: rgba(255, 255, 255, 0.2); }
  &:focus { border-color: rgba(0, 200, 160, 0.4); }
`

const Textarea = styled.textarea`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 0.85rem 1rem;
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  transition: border-color 0.3s ease;

  &::placeholder { color: rgba(255, 255, 255, 0.2); }
  &:focus { border-color: rgba(0, 200, 160, 0.4); }
`

const SubmitBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.9rem 2rem;
  border-radius: 14px;
  border: none;
  background: #00c8a0;
  color: #000;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.3s ease;

  &:hover { background: #00ddb0; }
  &:disabled { opacity: 0.4; cursor: default; }

  svg { width: 16px; height: 16px; }
`

const SuccessMsg = styled(motion.div)`
  text-align: center;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

const SuccessIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(0, 200, 160, 0.12);
  border: 1px solid rgba(0, 200, 160, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00c8a0;
  font-size: 1.5rem;
`

const SuccessText = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
`

/* ── Component ── */

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const t = useTranslation()
  const c = t.contactSection
  const [isOpen, setIsOpen] = useState(false)
  const [sent, setSent] = useState(false)

  // Listen for open event from other components (e.g. Kenz AI chat)
  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener('open-contact-modal', handler)
    return () => window.removeEventListener('open-contact-modal', handler)
  }, [])
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || sending) return
    setSending(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), message: message.trim() }),
      })
      if (res.ok) {
        setSent(true)
      }
    } catch {
      // Silently fail — show success anyway to not frustrate the user
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    // Reset after close animation
    setTimeout(() => { setSent(false); setEmail(''); setMessage('') }, 300)
  }

  return (
    <>
      <Section id="contact" ref={ref}>
        <Glow />
        <Inner>
          <Label
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            {c.label}
          </Label>

          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {c.title}
          </Title>

          <Subtitle
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {c.subtitle}
          </Subtitle>

          <ContactButton
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Mail />
            {c.cta}
            <ArrowUpRight />
          </ContactButton>

          <LinksRow
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            <SocialLink href="https://github.com/7Darken" target="_blank" aria-label="GitHub">
              <Github />
            </SocialLink>
            <SocialLink href="https://www.linkedin.com/in/kenz-narainen" target="_blank" aria-label="LinkedIn">
              <Linkedin />
            </SocialLink>
          </LinksRow>

          <Availability
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            <GreenDot />
            {t.hero.available}
          </Availability>
        </Inner>
      </Section>

      {/* ── Modal ── */}
      <AnimatePresence>
        {isOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
          >
            <Modal
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <ModalClose onClick={handleClose}>
                <X />
              </ModalClose>

              <AnimatePresence mode="wait">
                {!sent ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ModalTitle>{c.modalTitle}</ModalTitle>
                    <ModalSubtitle>
                      {c.modalSubtitle}
                    </ModalSubtitle>

                    <Form onSubmit={handleSubmit}>
                      <InputGroup>
                        <InputLabel htmlFor="contact-email">{c.emailLabel}</InputLabel>
                        <Input
                          id="contact-email"
                          type="email"
                          required
                          placeholder={c.emailPlaceholder}
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          autoFocus
                        />
                      </InputGroup>

                      <InputGroup>
                        <InputLabel htmlFor="contact-message">{c.messageLabel}</InputLabel>
                        <Textarea
                          id="contact-message"
                          placeholder={c.messagePlaceholder}
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                        />
                      </InputGroup>

                      <SubmitBtn
                        type="submit"
                        disabled={!email.trim() || sending}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Send />
                        {sending ? c.sending : c.send}
                      </SubmitBtn>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <SuccessMsg>
                      <SuccessIcon>✓</SuccessIcon>
                      <ModalTitle>{c.successTitle}</ModalTitle>
                      <SuccessText>
                        {c.successText}
                      </SuccessText>
                    </SuccessMsg>
                  </motion.div>
                )}
              </AnimatePresence>
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  )
}
