import { auth, signIn, signOut } from "@/auth";

export default async function LoginTestPage() {
  const session = await auth();

  return (
    <div style={{ padding: 40 }}>
      <h1>ログインテスト</h1>
      {session?.user ? (
        <>
          <p>ログイン中: {session.user.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit">ログアウト</button>
          </form>
        </>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button type="submit">Googleでログイン</button>
        </form>
      )}
    </div>
  );
}