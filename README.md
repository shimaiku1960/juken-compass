# Study Log App

学習記録を管理するための Web アプリケーション。ブログ形式で学習内容を投稿・編集・削除でき、ユーザー認証とプロフィール管理機能を備えています。

## テックスタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| UI | React 19 |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| ORM | Prisma 7 |
| データベース | PostgreSQL |
| 認証 | Supabase Auth |
| バリデーション | Zod |

## 機能

- **記事管理** — 学習記録の作成・編集・削除（CRUD）
- **ユーザー認証** — メール/パスワードによるサインアップ・ログイン・ログアウト
- **プロフィール管理** — ニックネームの表示・編集
- **ルート保護** — 未認証ユーザーのリダイレクト

## セットアップ

### 前提条件

- Node.js 18 以上
- PostgreSQL
- Supabase プロジェクト（認証用）

### 環境変数

プロジェクトルートに `.env` ファイルを作成し、以下を設定してください：

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### インストールと起動

```bash
# 依存関係のインストール
npm install

# Prisma Client の生成
npx prisma generate

# データベースマイグレーション
npx prisma migrate deploy

# 開発サーバーの起動
npm run dev
```

http://localhost:3000 でアプリにアクセスできます。

## npm scripts

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | Prisma 生成 + マイグレーション + 本番ビルド |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLint によるコード検査 |

## プロジェクト構成

```
app/
├── page.tsx              # トップページ（記事一覧）
├── login/                # ログインページ
├── signup/               # サインアップページ
├── create/               # 記事作成ページ
├── edit/[id]/            # 記事編集ページ
├── profile/              # プロフィールページ
├── auth/                 # 認証関連（Server Actions / コールバック）
├── api/                  # API ルート
│   ├── posts/            # 記事 CRUD
│   └── profile/          # プロフィール更新
└── components/           # 共通コンポーネント

lib/
├── prisma.ts             # Prisma クライアント
└── supabase/             # Supabase クライアント（client / server / middleware）

prisma/
├── schema.prisma         # データベーススキーマ
└── migrations/           # マイグレーションファイル
```

## データベース

### モデル

- **Post** — 記事（title, description, date, updatedAt）
- **Profile** — ユーザープロフィール（Supabase Auth と連携）
- **StudyLog** — 学習ログ（date, minutes, category, memo）※今後実装予定
