"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type University = {
  id: number;
  name: string;
  prefecture: string;
  type: string;
  _count: { faculties: number };
};

type Props = {
  universities: University[];
};

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1 text-sm transition-colors ${
        active
          ? "bg-blue-500 text-white border-blue-500"
          : "bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

export default function UniversitySearch({ universities }: Props) {
  const [name, setName] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);

  type Conditions = { name: string; types: string[]; prefs: string[] };
  const [applied, setApplied] = useState<Conditions | null>(null);

  // 選択肢は登録大学から自動抽出
  const typeOptions = ["国立", "公立", "私立"].filter((t) =>
    universities.some((u) => u.type === t)
  );
  const prefOptions = [
    ...new Set(universities.map((u) => u.prefecture).filter(Boolean)),
  ];

  const toggle = <T,>(
    value: T,
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const reset = () => {
    setName("");
    setSelectedTypes([]);
    setSelectedPrefs([]);
    setApplied(null);
  };

  const matches = (u: University, c: Conditions) => {
    const matchName =
      c.name.trim() === "" || u.name.includes(c.name.trim());
    const matchType = c.types.length === 0 || c.types.includes(u.type);
    const matchPref = c.prefs.length === 0 || c.prefs.includes(u.prefecture);
    return matchName && matchType && matchPref;
  };

  const draft: Conditions = {
    name,
    types: selectedTypes,
    prefs: selectedPrefs,
  };

  const previewCount = universities.filter((u) => matches(u, draft)).length;
  const results = applied
    ? universities.filter((u) => matches(u, applied))
    : null;

  return (
    <div>
      <div className="border rounded-lg p-4 space-y-4 mb-6">
        <Input
          placeholder="大学名で探す"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div>
          <p className="text-sm text-gray-500 mb-2">設置区分</p>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((t) => (
              <Chip
                key={t}
                active={selectedTypes.includes(t)}
                onClick={() => toggle(t, setSelectedTypes)}
              >
                {t}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">都道府県</p>
          <div className="flex flex-wrap gap-2">
            {prefOptions.map((p) => (
              <Chip
                key={p}
                active={selectedPrefs.includes(p)}
                onClick={() => toggle(p, setSelectedPrefs)}
              >
                {p}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <p className="text-sm">
            対象 <span className="font-bold text-lg">{previewCount}</span> 校
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={reset}
              className="text-sm text-gray-500 hover:underline"
            >
              条件をリセット
            </button>
            <Button onClick={() => setApplied(draft)}>検索</Button>
          </div>
        </div>
      </div>

      {results === null ? (
        <p className="text-gray-500 text-sm">
          条件を選んで「検索」を押してください。
        </p>
      ) : (
        <>
          <ul className="space-y-2">
            {results.map((u) => (
              <li key={u.id}>
                <Link
                  href={`/explore/${u.id}`}
                  className="border rounded px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-sm text-gray-500">
                      {u.prefecture} / {u.type}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {u._count.faculties > 0
                      ? `学部 ${u._count.faculties}`
                      : "学部情報準備中"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {results.length === 0 && (
            <p className="text-gray-500 text-sm">
              条件に合う大学が見つかりませんでした。
            </p>
          )}
        </>
      )}
    </div>
  );
}
