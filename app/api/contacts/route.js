import { q } from '@/backend/lib/db';
import { isAdmin } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    return Response.json(await q('SELECT id,name,email,message,created_at FROM contacts ORDER BY created_at DESC'));
  } catch (error) {
    console.error('Contact list failed', error);
    return Response.json({ error: 'Contact submissions are unavailable' }, { status: 503 });
  }
}
