import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  
  if (!path) {
    return NextResponse.json({ error: 'Path parameter required' }, { status: 400 })
  }
  
  // Test redirect logic
  let newPath = path
  if (path.startsWith('/product/')) {
    newPath = path.replace('/product/', '/products/')
  } else if (path.startsWith('/collection/')) {
    newPath = path.replace('/collection/', '/collections/')
  } else if (path.startsWith('/blog/')) {
    newPath = path.replace('/blog/', '/blogs/')
  }
  
  return NextResponse.json({
    originalPath: path,
    newPath: newPath,
    shouldRedirect: path !== newPath,
    timestamp: new Date().toISOString(),
  })
}