import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import { JWT_SECRET } from '$env/static/private';
import { db } from './db';
import * as table from './db/schema';

export const authRouter = new Elysia({ prefix: '/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
      exp: '30d' // 30 days expiry
    })
  )
  .post('/login', async ({ body, jwt, error }) => {
    const { username, password } = body;

    const results = await db.select().from(table.user).where(eq(table.user.username, username));
    const user = results.at(0);
    
    if (!user) {
      return error(401, 'Invalid credentials');
    }

    const validPassword = await verify(user.passwordHash, password);
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
      password: t.String()
    })
  })
  .post('/register', async ({ body, jwt, error }) => {
    const { username, password } = body;

    const userId = generateUserId();
    const passwordHash = await hash(password);

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
      return error(400, 'Registration failed');
    }
  }, {
    body: t.Object({
      username: t.String(),
      password: t.String()
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

function generateUserId() {
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const id = encodeBase32LowerCase(bytes);
  return id;
}
