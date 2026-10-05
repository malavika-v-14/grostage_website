import { v2 as cloudinary } from 'cloudinary'; import { isAdmin } from '@/lib/auth';
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
export async function POST(req) {
  if (!(await isAdmin())) return Response.json({}, { status: 401 });
  const file = (await req.formData()).get('file'); if (!file) return Response.json({ error: 'No file' }, { status: 400 });
  const buf = Buffer.from(await file.arrayBuffer());
  try {
    const url = await new Promise((res, rej) => cloudinary.uploader.upload_stream({ folder: 'grostage' }, (e, r) => e ? rej(e) : res(r.secure_url)).end(buf));
    return Response.json({ url });
  } catch (e) { return Response.json({ error: e.message }, { status: 500 }); }
}
