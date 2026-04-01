import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, message } = await request.json()

  if (!email || !email.trim()) {
    return NextResponse.json({ error: 'Email requis' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    return NextResponse.json({ error: 'Config manquante' }, { status: 500 })
  }

  const text = [
    '📩 *Nouveau message portfolio*',
    '',
    `*Email :* ${email}`,
    '',
    `*Message :*`,
    message?.trim() || '_Aucun message_',
  ].join('\n')

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Erreur Telegram' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
