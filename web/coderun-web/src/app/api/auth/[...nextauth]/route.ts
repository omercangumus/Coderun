// NextAuth entegrasyonu ilerleyen sürümlerde eklenecek.
// Şu an bu route kullanılmıyor — uygulama kendi JWT/cookie auth akışını kullanıyor.
// Bu dosya silinmemeli; Next.js App Router'da api/auth path'i rezerve edilmiş olabilir.
export async function GET() {
  return new Response(JSON.stringify({ error: 'Not implemented' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST() {
  return new Response(JSON.stringify({ error: 'Not implemented' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' },
  });
}
