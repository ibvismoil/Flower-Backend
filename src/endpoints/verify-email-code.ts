// src/endpoints/verify-email-code.ts
import type { Endpoint } from 'payload'

export const verifyEmailCode: Endpoint = {
  path: '/api/verify-email-code',
  method: 'post',
  handler: async (req, res) => {
    const { email, code } = req.body

    if (!email || !code) {
      return res.status(400).json({ message: 'Email и код обязательны' })
    }

    const users = await req.payload.find({
      collection: 'users',
      where: {
        email: { equals: email },
        emailVerificationCode: { equals: code },
      },
    })

    if (users.docs.length === 0) {
      return res.status(401).json({ message: 'Неверный код' })
    }

    const user = users.docs[0]

    await req.payload.update({
      collection: 'users',
      id: user.id,
      data: {
        isEmailVerified: true,
        emailVerificationCode: '', // очищаем
      },
    })

    // Логиним пользователя
    const token = await req.payload.auth.login('users', user.id)
    res.json({ token, message: 'Email подтверждён' })
  },
}
