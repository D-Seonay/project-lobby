import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

let pusher: Pusher | null = null;

const getPusher = () => {
  if (pusher) return pusher;

  const PUSHER_APP_ID = process.env.PUSHER_APP_ID;
  const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const PUSHER_SECRET = process.env.PUSHER_SECRET;
  const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!PUSHER_APP_ID || !PUSHER_KEY || !PUSHER_SECRET || !PUSHER_CLUSTER) {
    throw new Error('Missing Pusher environment variables');
  }

  pusher = new Pusher({
    appId: PUSHER_APP_ID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER,
    useTLS: true,
  });

  return pusher;
};

export async function POST(req: NextRequest) {
  try {
    const currentPusher = getPusher();
    const body = await req.formData();
    const socketId = body.get('socket_id');
    const channelName = body.get('channel_name');

    if (typeof socketId !== 'string' || typeof channelName !== 'string') {
      return new NextResponse('Missing or invalid socket_id or channel_name', { status: 400 });
    }

    const userId = `user_${Math.random().toString(36).slice(2, 9)}`;
    const presenceData = {
      user_id: userId,
      user_info: { name: 'Anonymous Explorer' },
    };

    const authResponse = currentPusher.authenticate(socketId, channelName, presenceData);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
