import fs from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";
import cleanPlugin from "vite-plugin-clean";
import handlebars from "vite-plugin-handlebars";
import viteImagemin from "vite-plugin-imagemin";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "docs");

// 各ページのメタデータを読み込む
const metadata = JSON.parse(fs.readFileSync(resolve(__dirname, "./src/metadata.json")));

/*
 * htmlファイルのみ抽出
 */

// HTMLの複数出力を自動化する
//./src配下のファイル一式を取得
const fileNameList = fs.readdirSync(resolve(__dirname, "./src/"));

//htmlファイルのみ抽出
const htmlFileList = fileNameList.filter((file) => /.html$/.test(file));

const inputFiles = {};
for (let i = 0; i < htmlFileList.length; i++) {
	const file = htmlFileList[i];
	inputFiles[file.slice(0, -5)] = resolve(__dirname, "./src/" + file);
}

export default defineConfig({
	server: {
		host: true, //IPアドレスを有効化
	},
	root: root, //開発ディレクトリ設定
	emptyOutDir: true,
	publicDir: "public",
	publicPath: "./",
	base: "/highway-study/",
	build: {
		outDir: outDir,
		//出力場所の指定
		rollupOptions: {
			//ファイル出力設定
			output: {
				assetFileNames: (assetInfo) => {
					let extType = assetInfo.name.split(".")[1];
					//Webフォントファイルの振り分け
					if (/ttf|otf|eot|woff|woff2/i.test(extType)) {
						extType = "fonts";
					}
					if (/png|jpe?g|svg|webp|avif|gif|tiff|bmp|ico/i.test(extType)) {
						extType = "img";
					}
					return `assets/${extType}/[name][extname]`;
				},
				chunkFileNames: "assets/js/[name].js",
				entryFileNames: "assets/js/[name].js",
			},
			input: inputFiles,
		},
	},
	plugins: [
		cleanPlugin(), //build時にファイルを削除
		handlebars({
			//コンポーネントの格納ディレクトリを指定
			partialDirectory: resolve(__dirname, "./src/html-components"),
			//各ページ情報の読み込み
			context(pagePath) {
				return metadata[pagePath];
			},
		}),
		viteImagemin({
			// 画像圧縮の設定
			gifsicle: {
				optimizationLevel: 3,
			},
			mozjpeg: {
				quality: 65,
				progressive: true,
			},
			pngquant: {
				quality: [0.65, 0.8],
				speed: 1,
			},
			svgo: {
				plugins: [
					{
						name: "removeViewBox",
					},
				],
			},
		}),
	],
});
