import { NextResponse } from 'next/server';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/spotify/callback`;
const scopes = ['user-read-currently-playing', 'user-read-recently-played'].join(' ');

export async function GET() {
  if (!client_id) {
    return NextResponse.json({ error: 'SPOTIFY_CLIENT_ID is not defined' }, { status: 500 });
  }

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirect_uri)}`;

  return NextResponse.redirect(spotifyAuthUrl);
}
