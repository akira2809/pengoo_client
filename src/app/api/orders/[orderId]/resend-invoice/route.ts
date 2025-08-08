import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  const orderId = params.orderId;
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices/${orderId}`;
  const res = await fetch(apiUrl);

  if (!res.ok) {
    return new NextResponse("Không tìm thấy hóa đơn", { status: 404 });
  }

  const pdfBuffer = await res.arrayBuffer();
  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${orderId}.pdf`,
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const orderId = params.orderId;
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices/${orderId}/resend`;

  try {
    const res = await fetch(apiUrl, { method: "POST" });
    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: false, error: data.message || "Không thể gửi lại hóa đơn" }, { status: res.status });
    }
    return NextResponse.json({ success: true, message: "Đã gửi lại hóa đơn thành công" });
  } catch {
    return NextResponse.json({ success: false, error: "Có lỗi xảy ra khi gửi lại hóa đơn" }, { status: 500 });
  }
}