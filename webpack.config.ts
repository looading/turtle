import "webpack-dev-server"
import webpack, { Configuration } from "webpack"

import { CleanWebpackPlugin } from 'clean-webpack-plugin'

import path from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import CopyPlugin from 'copy-webpack-plugin'


const isProd = process.env.NODE_ENV === 'production'

const config: Configuration = {
	entry: './src/index.tsx',
	devtool: isProd ? "cheap-module-source-map" : "cheap-module-eval-source-map",
	mode: isProd ? 'production' : 'development',
	output: {
		filename: "[name].[hash].js",
		path: path.join(__dirname, "server", "app", "public"),
		chunkFilename: "[name].[hash].chunk.js",
	},
	node: {
		fs: "empty"
	},
	resolve: {
		extensions: [
			".tsx",
			".ts",
			".jsx",
			".js",
			".less",
			".css",
			".json"
		],
		alias: {
			"@": path.resolve(__dirname, 'src')
		}
	},
	module: {
		rules: [
			{
				test: /\.(svg|png|jpg||gif)$/,
				loader: "url-loader",
			},
			{
				test: /\.md$/,
				loader: 'raw-loader'
			},
			{
				test: /\.css$/,
				include: /node_modules/,
				use: [
					"style-loader",
					"css-loader",
				]
			},
			{
				test: /\.less$/,
				include: /node_modules/,
				use: [
					"style-loader",
					"css-loader",
					"less-loader"
				]
			},
			{
				test: /\.module\.less$/,
				exclude: /node_modules/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							modules: true
						}
					},
					"less-loader"
				]
			},
			{
				test: /\.[jt]sx?$/,
				use: 'ts-loader',
				include: [
					path.resolve(__dirname, 'src')
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "src", "index.ejs")
		}),
		new CopyPlugin({
			patterns: [
				{ from: "src/assets", to: "static" },
			],
		}),
		new webpack.DefinePlugin({
			SC_DISABLE_SPEEDY: true
		})
	],
	devServer: {
		port: 3000,
		contentBase: path.join(__dirname, "dist"),
		historyApiFallback: true,
		disableHostCheck: true,
		hot: true,
		open: true,
		host: '0.0.0.0',
		writeToDisk: true
	},
	optimization: {
		splitChunks: {
			chunks: 'async',
			minSize: 20000,
			maxSize: 0,
			minChunks: 1,
			maxAsyncRequests: 30,
			maxInitialRequests: 30,
			automaticNameDelimiter: '~',
			cacheGroups: {
				defaultVendors: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
          chunks: 'all'
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true
				},
			},
		},
	}
}

export default config