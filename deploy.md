- 1.1 vite.config.js
    
    ```jsx
      base: process.env.NODE_ENV === "production" ? "/front_6th_chapter1-1/" : "/",
      
      build: {
        outDir: "dist",
        assetsDir: "assets",
        sourcemap: false,
        rollupOptions: {
          output: {
            manualChunks: undefined,
          },
        },
      },
      
    ```
    
- 1.2 package.json 스크립트 추가하기
    
    ```json
      "scripts": {
        "build:prod": "NODE_ENV=production vite build",
        "preview:prod": "NODE_ENV=production vite preview",
        "deploy": "pnpm build:prod && pnpm preview:prod"
      }
    ```
    
- 2.1 GitHub Pages 자동 배포 workflow 구현
    
    ```yaml
    name: Deploy to GitHub Pages
    
    on:
      push:
        branches: [main]
    
    jobs:
      deploy:
        runs-on: ubuntu-latest
    
        steps:
          - name: Checkout
            uses: actions/checkout@v4
    
          - name: Setup Node.js
            uses: actions/setup-node@v4
            with:
              node-version: "18"
    
          - name: Setup pnpm
            uses: pnpm/action-setup@v2
            with:
              version: 8
    
          - name: Install dependencies
            run: pnpm install
    
          - name: Build
            run: pnpm build
            env:
              NODE_ENV: production
    
          - name: Deploy to GitHub Pages
            uses: peaceiris/actions-gh-pages@v3
            if: github.ref == 'refs/heads/main'
            with:
              github_token: ${{ secrets.GITHUB_TOKEN }}
              publish_dir: ./dist
    
    ```
    
- 2.2 GitHub 레포 설정
    1. **Settings** > **Pages**로 이동
    2. **Source**: "**GitHub Actions**" 선택
    
    ![image.png](attachment:d1ec0702-d22e-44bf-8dda-fafb199aa80e:image.png)
    
- 3.1 MSW 배포 설정하기(main.js)
    
    ```jsx
    const enableMocking = () =>
      import("./mocks/browser.js").then(({ worker, workerOptions }) => 
        worker.start(workerOptions)
      );
      
    if (import.meta.env.MODE !== "test") {
      enableMocking().then(main);
    } else {
      main();
    }
    ```
    
- 3.2 src/mocks/browser.js 설정
    
    ```jsx
    const basePath = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";
    
    export const worker = setupWorker(...handlers);
    
    // Worker start 옵션을 export하여 main.js에서 사용
    export const workerOptions = import.meta.env.PROD
      ? {
          serviceWorker: {
            url: `${basePath}/mockServiceWorker.js`,
          },
          onUnhandledRequest: "bypass",
        }
      : {
          onUnhandledRequest: "bypass",
        };
    ```
    
- 4.1 router 관련 설정
    
    이런 식으로 router에서 라우팅 가능하도록
    
    ```jsx
    const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";
    
    const getAppPath = (fullPath = window.location.pathname) => {
      return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
    };
    
    const getFullPath = (appPath) => {
      return BASE_PATH + appPath;
    };
    ```
    
- **4.2 GitHub Pages SPA 404 처리**
    
    404 html 페이지에 해당 스크립트를 추가하여 기본적인 github pages 404 페이지로 넘어가지 않도록 구현합니다
    
    ```jsx
    <!doctype html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>상품 쇼핑몰</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: "#3b82f6",
                  secondary: "#6b7280",
                },
              },
            },
          };
        </script>
        <script type="text/javascript">
          var pathSegmentsToKeep = 1;
          var l = window.location;
          l.replace(
            l.protocol +
              "//" +
              l.hostname +
              (l.port ? ":" + l.port : "") +
              l.pathname
                .split("/")
                .slice(0, 1 + pathSegmentsToKeep)
                .join("/") +
              "/?/" +
              l.pathname.slice(1).split("/").slice(pathSegmentsToKeep).join("/").replace(/&/g, "~and~") +
              (l.search ? "&" + l.search.slice(1).replace(/&/g, "~and~") : "") +
              l.hash,
          );
        </script>
      </head>
      <body class="bg-gray-50">
        <div id="root"></div>
      </body>
    </html>
    ```
    
- **4.3 index.html 처리**
    
    404 html 페이지에 해당 스크립트 추가
    
    ```jsx
     <script type="text/javascript">
        // 404.html에서 리다이렉트된 URL을 원래 경로로 복원
        (function (l) {
          if (l.search[1] === "/") {
            var decoded = l.search
              .slice(1)
              .split("&")
              .map(function (s) {
                return s.replace(/~and~/g, "&");
              })
              .join("?");
            window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
          }
        })(window.location);
      </script>
    ```
    

→ 로컬에서 push하면 workflow때문에 바로 배포됩니다!