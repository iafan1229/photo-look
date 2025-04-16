import AdminVerification from "@/components/AdminVerification";

export default function VerificationPage({
  searchParams,
}: {
  searchParams: { token: string; action: string };
}) {
  const { token, action } = searchParams;

  // 토큰이 없으면 오류 메시지 표시
  if (!token) {
    return (
      <div className='error-container'>
        <h1>오류</h1>
        <p>유효하지 않은 접근입니다. 토큰이 필요합니다.</p>
      </div>
    );
  }

  return <AdminVerification token={token} action={action} />;
}
