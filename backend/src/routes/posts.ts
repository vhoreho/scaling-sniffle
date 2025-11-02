import express, { Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

// Все routes требуют аутентификации
router.use(authenticate);

// GET /api/posts - Получить все посты пользователя
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: req.userId!,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/posts/:id - Получить один пост
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findFirst({
      where: {
        id,
        authorId: req.userId!,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/posts - Создать новый пост
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = postSchema.parse(req.body);

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: req.userId!,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({ post });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/posts/:id - Обновить пост
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = postSchema.parse(req.body);

    // Проверяем, что пост принадлежит пользователю
    const existingPost = await prisma.post.findFirst({
      where: {
        id,
        authorId: req.userId!,
      },
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    res.json({ post });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/posts/:id - Удалить пост
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Проверяем, что пост принадлежит пользователю
    const existingPost = await prisma.post.findFirst({
      where: {
        id,
        authorId: req.userId!,
      },
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

