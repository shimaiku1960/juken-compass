# Juken Compass（受験コンパス）

大学受験生のための学習進捗・志望校管理アプリ。全国の大学マスターから志望校を選んで管理し、受験日程をカレンダーで俯瞰、併願校を条件で探せます。「受験ナビ＋羅針盤」をコンセプトに、ゴールから逆算して受験準備を支援します。

🌐 **本番環境**: AWS EC2 上でセルフホスト（http://13.158.37.196）

## テックスタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| UI | React 19 / shadcn/ui |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| フォーム | React Hook Form + Zod |
| カレンダー | Schedule-X |
| CMS | microCMS |
| ORM | Prisma 7 |
| データベース | PostgreSQL (Supabase) |
| 認証 | Supabase Auth |
| インフラ | AWS EC2 (Ubuntu) / Nginx / PM2 |
| CI/CD | GitHub Actions |

## 主な機能

- **志望校管理** — 全国の大学・学部マスターから志望校を選択。複数併願に対応し、同一学部の重複登録を多層防御（フロント／API／DB の3層）で防止
- **大学を探す** — 全国 823 大学のマスターから、大学名・都道府県・設置区分で絞り込み。学部詳細では学部系統タグを表示
- **受験日程カレンダー** — 登録した志望校の受験日を Schedule-X で月表示。ダッシュボードで一覧
- **ユーザー認証** — Supabase Auth によるサインアップ・ログイン・ログアウト・ルート保護
- **プロフィール管理** — ニックネームの表示・編集
- **ブログ** — microCMS で管理する記事の一覧・詳細表示

## データソース

全国大学マスターは [ASTI アマノ技研「国内大学の位置データ」](https://amano-tec.com/)（商用利用無料）を利用。国立・公立・私立の 823 校を取り込み、住所から都道府県・設置区分を整形して投入しています（`scripts/transform-universities.ts`）。

## セットアップ

### 前提条件

- Node.js 20 以上
- PostgreSQL（Supabase 推奨）
- Supabase プロジェクト（認証用）
- microCMS アカウント（ブログ管理用）

### 環境変数

プロジェクトルートに `.env` を作成し、以下を設定します：

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

# 大学マスターなどの初期データ投入
npx prisma db seed

# 開発サーバーの起動
npm run dev
```

http://localhost:3000 でアクセスできます。

## npm scripts

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | Prisma 生成 + マイグレーション + 本番ビルド |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLint によるコード検査 |

## デプロイ（AWS EC2）

本番環境は Vercel ではなく AWS EC2 上にセルフホストしています（インフラ学習目的）。

- **EC2 (Ubuntu 24.04 / t3.micro)** にアプリを配置
- **PM2** でプロセスを常駐化（クラッシュ・再起動時の自動復活）
- **Nginx** をリバースプロキシとして配置（80 → 3000）
- ビルド時のメモリ不足対策として **swap 2GB** を追加
- **GitHub Actions** で `main` への push をトリガーに自動デプロイ

DB・認証は Supabase をそのまま利用しています。

## プロジェクト構成

```
app/
├── page.tsx              # ダッシュボード（受験日程カレンダー）
├── explore/              # 大学を探す
│   ├── page.tsx          # 大学一覧（絞り込み検索）
│   └── [universityId]/   # 大学詳細（学部一覧・志望校追加）
├── goals/                # 志望校管理
├── profile/              # プロフィール
├── blog/                 # ブログ一覧（microCMS）
├── articles/[id]/        # 記事詳細
├── login/ signup/        # 認証ページ
├── auth/                 # 認証 Server Actions / コールバック
├── api/
│   ├── goals/            # 志望校 CRUD
│   └── profile/          # プロフィール更新
└── components/           # 画面コンポーネント

lib/
├── microcms.ts           # microCMS クライアント
├── prisma.ts             # Prisma クライアント
├── supabase/             # Supabase クライアント（client / server / middleware）
└── validations/          # Zod スキーマ（サーバー/クライアント共通）

prisma/
├── schema.prisma         # データベーススキーマ
├── seed.ts               # 初期データ投入
└── migrations/           # マイグレーション

scripts/
└── transform-universities.ts  # 大学マスター CSV → JSON 整形

data/                     # 大学マスター元データ・整形済み JSON
```

## データベースモデル

- **Profile** — ユーザープロフィール（Supabase Auth と連携）
- **FinalGoal** — 志望校（Profile × Faculty。`@@unique` で重複防止）
- **University** — 大学マスター（名称・都道府県・設置区分）
- **Faculty** — 学部マスター（受験日を保持。University にリレーション）
- **Tag** — 学部系統タグ（Faculty と多対多）
