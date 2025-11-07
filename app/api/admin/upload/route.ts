import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Проверка типа файла
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Allowed: jpg, jpeg, png, webp' }, { status: 400 })
        }

        // Проверка размера файла (5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 })
        }

        // Генерация уникального имени файла
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 15)
        const extension = file.name.split('.').pop() || 'jpg'
        const filename = `product-${timestamp}-${random}.${extension}`

        // Загрузка в Vercel Blob Storage
        const blob = await put(filename, file, {
            access: 'public',
            contentType: file.type,
        })

        return NextResponse.json({ success: true, url: blob.url }, { status: 200 })
    } catch (error: any) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }
}



