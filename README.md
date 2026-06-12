# Study Log App

学習記録を管理するための Web アプリケーション。microCMS でブログ記事を管理し、Todo リストで学習タスクを追跡できます。ユーザー認証とプロフィール管理機能を備えています。

## テックスタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| UI | React 19 |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| CMS | microCMS |
| ORM | Prisma 7 |
| データベース | PostgreSQL |
| 認証 | Supabase Auth |
| バリデーション | Zod |

## 機能

- **ブログ記事** — microCMS で管理する記事の一覧表示・詳細表示
- **Todo リスト** — 学習タスクの追加・完了切替・削除（楽観的更新）
- **ユーザー認証** — メール/パスワードによるサインアップ・ログイン・ログアウト
- **プロフィール管理** — ニックネームの表示・編集
- **ルート保護** — 未認証ユーザーのリダイレクト

## セットアップ

### 前提条件

- Node.js 18 以上
- PostgreSQL
- Supabase プロジェクト（認証用）
- microCMS アカウント（ブログ管理用）

### 環境変数

プロジェクトルートに `.env` ファイルを作成し、以下を設定してください：

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
MICROCMS_API_KEY="your-microcms-api-key"
MICROCMS_SERVICE_DOMAIN="your-service-domain"
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
├── page.tsx              # トップページ（記事一覧 / microCMS）
├── articles/[id]/        # 記事詳細ページ
├── todos/                # Todo リストページ
├── login/                # ログインページ
├── signup/               # サインアップページ
├── profile/              # プロフィールページ
├── auth/                 # 認証関連（Server Actions / コールバック）
├── api/                  # API ルート
│   ├── todos/            # Todo CRUD
│   └── profile/          # プロフィール更新
└── components/           # 共通コンポーネント

lib/
├── microcms.ts           # microCMS クライアント
├── prisma.ts             # Prisma クライアント
└── supabase/             # Supabase クライアント（client / server / middleware）

prisma/
├── schema.prisma         # データベーススキーマ
└── migrations/           # マイグレーションファイル
```

## データベース

### モデル

- **Profile** — ユーザープロフィール（Supabase Auth と連携）
- **Todo** — 学習タスク（title, completed, date / Profile にリレーション）
- **StudyLog** — 学習ログ（date, minutes, category, memo）※今後実装予定
