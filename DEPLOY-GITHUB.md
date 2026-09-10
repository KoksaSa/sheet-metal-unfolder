# 📦 Публикация Sheet Metal Unfolder на GitHub

Версия бандла: **v5.7** (подставляется автоматически скриптом `.zscripts/make-github-bundle.sh`).

Папка `github-release/` — **готовый git-репозиторий**: все файлы приложения лежат в корне
(`index.html` в корне → GitHub Pages работает из коробки), плюс:

- `README.md` — описание проекта (сверху добавлен блок «🚀 Демо и установка»);
- `.gitignore` — системные/IDE-мусорные файлы;
- `.github/workflows/pages.yml` — GitHub Actions: авто-деплой на GitHub Pages при push в `main`;
- этот файл — инструкция по публикации.

> Из песочницы нет доступа к GitHub (нет remote, gh CLI и токена), поэтому публикация
> выполняется вручную на вашей машине. Ниже — 2 команды + пара кликов в веб-интерфейсе.

---

## 1️⃣ Залить код на GitHub

Сначала на github.com создайте **пустой** репозиторий:
`New repository` → имя, например `sheet-metal-unfolder` → **НЕ ставьте** галочки
(Add a README / .gitignore / license) → `Create repository`.

Затем из корня проекта выполните две команды
(замените `USERNAME/REPO` на свои логин и имя репозитория):

```bash
cd github-release && git init && git add . && git commit -m "v5.7"
```

```bash
git remote add origin https://github.com/USERNAME/REPO.git && git branch -M main && git push -u origin main
```

> При первом `git push` GitHub спросит логин и пароль — в качестве пароля нужен
> **Personal Access Token** (Settings → Developer settings → Tokens), не пароль аккаунта.

## 2️⃣ Включить GitHub Pages

1. В репозитории: **Settings → Pages → Source: `GitHub Actions`** (не «Deploy from a branch»!).
2. Вкладка **Actions**: workflow «Deploy to GitHub Pages» запустится сам — дождитесь зелёной
   галочки (~1 минута). Можно запустить и вручную: workflow_dispatch (кнопка `Run workflow`).
3. Сайт откроется по адресу: **https://USERNAME.github.io/REPO/**
4. Откройте `README.md` в репозитории и в блоке «🚀 Демо и установка» (самый верх файла)
   замените ссылку-заглушку `https://USERNAME.github.io/REPO_NAME/` на реальный адрес, затем
   закоммитьте и запушьте изменение.

## 3️⃣ Создать Release

1. В репозитории: **Releases → Create a new release → Choose a tag** → введите новый тег
   `v5.7` → Target: `main`.
2. Название: `Sheet Metal Unfolder v5.7`; в описании можно взять раздел
   «Что нового» из `README.md`.
3. **Attach binaries**: перетащите zip-архив приложения — готовый архив уже собран рядом с
   бандлом: `public/downloads/sheet-metal-unfolder-github-v5.7.zip`
   (это то же содержимое, что и `github-release/`).
4. `Publish release`.

## 4️⃣ Как обновлять в будущем

1. Внесите изменения в приложение (`sheet-metal-unfolder/`) и поднимите версию в
   `index.html` (например, v5.2).
2. Перезапустите сборку бандла: `./.zscripts/make-github-bundle.sh` — папка `github-release/`
   и zip-архив пересоздадутся автоматически с новой версией (скрипт идемпотентен).
3. Повторите публикацию (remote уже настроен, init не нужен):

   ```bash
   cd github-release && git add . && git commit -m "v5.2" && git push
   ```

   затем создайте новый Release с тегом `v5.2` (шаг 3) — Pages обновится сам при push.

## 📝 Примечания

- **Лицензия:** в проекте лицензии нет — выберите и добавьте её самостоятельно
  (рекомендуется MIT или Apache-2.0): на GitHub `Add file → Create new file → LICENSE`,
  либо положите файл `LICENSE` в `github-release/` перед коммитом.
- **Офлайн / статичность:** приложение полностью статическое и работает офлайн —
  three.js (`js/vendor/three.r128.min.js`) и lucide (`js/vendor/lucide.min.js`)
  вендорены локально, внешних CDN нет, сборка (npm/webpack) не требуется.
  GitHub Pages подходит идеально.
- **Имя репозитория:** URL GitHub Pages приводится к нижнему регистру — проще сразу назвать
  репозиторий строчными буквами через дефис (например, `sheet-metal-unfolder`).
