// src/endpoints/start-email-register.ts
import type { Endpoint } from 'payload'

export const startEmailRegister: Endpoint = {
  path: '/api/start-email-register',
  method: 'post',
  handler: async (req, res) => {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email обязателен' })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Найдём пользователя, если уже есть
    const existingUsers = await req.payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    })

    if (existingUsers.docs.length > 0) {
      // Обновим verificationCode
      await req.payload.update({
        collection: 'users',
        id: existingUsers.docs[0].id,
        data: { emailVerificationCode: code },
      })
    } else {
      // Создадим нового (временно)
      await req.payload.create({
        collection: 'users',
        data: {
          email,
          emailVerificationCode: code,
          isEmailVerified: false,
        },
      })
    }

    // Отправка письма
    await req.payload.sendEmail({
      to: email,
      subject: 'Ваш код подтверждения',
      html: `<p>Ваш код: <strong>${code}</strong></p>`,
    })

    res.json({ success: true, message: 'Код отправлен на email' })
  },
}
