import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { JWT_SECRET, PRIVATE_TURNSTILE_SECRET_KEY } from '$env/static/private';
import { db } from './db';
import * as table from './db/schema';

async function validateTurnstileToken(token: string) {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: PRIVATE_TURNSTILE_SECRET_KEY,
      response: token
    })
  });

  const data = await response.json();
  return data.success;
}

export const authRouter = new Elysia({ prefix: '/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
      exp: '30d' // 30 days expiry
    })
  )
  .post('/login', async ({ body, jwt, error }) => {
    const valid = await validateTurnstileToken(body.cfToken);
    if (!valid) {
      return error(400, 'Invalid captcha');
    }

    const { username, password } = body;

    const results = await db.select().from(table.user).where(eq(table.user.username, username));
    const user = results.at(0);
    
    if (!user) {
      return error(401, 'Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return error(401, 'Invalid credentials');
    }

    const token = await jwt.sign({
      userId: user.id,
      username: user.username
    });

    return { 
      token, 
      user: { 
        id: user.id, 
        username: user.username 
      } 
    };
  }, {
    body: t.Object({
      username: t.String(),
      password: t.String(),
      cfToken: t.String()
    })
  })
  .post('/register', async ({ body, jwt, error }) => {
    const valid = await validateTurnstileToken(body.cfToken);
    if (!valid) {
      return error(400, 'Invalid captcha');
    }

    const { username, password } = body;

    const userId = crypto.randomUUID();
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
      await db.insert(table.user).values({ id: userId, username, passwordHash });
      
      const token = await jwt.sign({
        userId,
        username
      });

      return { 
        token, 
        user: { 
          id: userId, 
          username 
        } 
      };
    } catch (e) {
      return error(400, `Registration failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }, {
    body: t.Object({
      username: t.String(),
      password: t.String(),
      cfToken: t.String()
    })
  })
  .get('/me', async ({ headers, jwt, error }) => {
    const authHeader = headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return error(401, 'Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    const payload = await jwt.verify(token);
    
    if (!payload) {
      return error(401, 'Invalid token');
    }

    return {
      id: payload.userId,
      username: payload.username
    };
  });
