const webpack = require('webpack');
const { basename, dirname, resolve } = require('path');
const browserslist = require('browserslist');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const postCSSPlugins = require('@wordpress/postcss-plugins-preset');
const jsonInSassImporter = require('node-sass-json-importer');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

module.exports = (env) => {
	const isProduction = env.NODE_ENV === 'production';
	const mode = isProduction ? 'production' : 'development';
	const fromConfigRoot = (fileName) =>
		path.join(path.dirname(__dirname), 'config', fileName);

	let target = 'browserslist';
	if (!browserslist.findConfig('.')) {
		target += ':' + fromConfigRoot('.browserslistrc');
	}

	// App directory
	const appDirectory = fs.realpathSync(process.cwd());

	// Gets absolute path of file within app directory
	const resolveAppPath = (relativePath) =>
		path.resolve(appDirectory, relativePath);

	const host = process.env.HOST || 'localhost';

	const cssLoaders = [
		{
			loader: MiniCSSExtractPlugin.loader,
		},
		{
			loader: require.resolve('css-loader'),
			options: {
				sourceMap: !isProduction,
				modules: {
					auto: true,
				},
			},
		},
		{
			loader: require.resolve('postcss-loader'),
			options: {
				postcssOptions: {
					ident: 'postcss',
					sourceMap: !isProduction,
					plugins: isProduction
						? [
								...postCSSPlugins,
								require('cssnano')({
									preset: [
										'default',
										{
											discardComments: {
												removeAll: true,
											},
										},
									],
								}),
						  ]
						: postCSSPlugins,
				},
			},
		},
	];

	return {
		mode,
		target: target,
		entry: {
			banner: './src/index.js',
		},
		output: {
			filename: '[name].js',
			path: resolve(process.cwd(), 'dist'),
		},
		resolve: {
			alias: {
				react: 'preact/compat',
				'react-dom': 'preact/compat',
				'react/jsx-runtime': 'preact/jsx-runtime',
				'lodash-es': 'lodash',
				Utils: path.resolve(__dirname, 'src/utils'),
			},
			extensions: ['.jsx', '.ts', '.tsx', '...'],
		},
		optimization: {
			// Only concatenate modules in production, when not analyzing bundles.
			concatenateModules: isProduction,
			minimize: isProduction,
			minimizer: [
				new TerserPlugin({
					parallel: true,
					terserOptions: {
						compress: {
							passes: 5,
						},
					},
					extractComments: false,
				}),
			],
		},
		module: {
			rules: [
				{
					test: /\.(j|t)sx?$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							babelrc: true,
							configFile: true,
							presets: [
								[
									'@babel/preset-env',
									{
										loose: true,
										debug: true,
										useBuiltIns: 'usage',
										corejs: require('core-js/package.json')
											.version,
									},
								],
							],
						},
					},
				},
				{
					test: /\.css$/,
					use: cssLoaders,
				},
				{
					test: /\.(sc|sa)ss$/,
					use: [
						...cssLoaders,
						{
							loader: require.resolve('sass-loader'),
							options: {
								sourceMap: !isProduction,
								sassOptions: {
									importer: jsonInSassImporter(),
								},
							},
						},
					],
				},
			],
		},
		plugins: [
			new CleanWebpackPlugin({
				cleanAfterEveryBuildPatterns: ['!fonts/**', '!images/**'],
				// Prevent it from deleting webpack assets during builds that have
				// multiple configurations returned in the webpack config.
				cleanStaleWebpackAssets: false,
			}),
			new MiniCSSExtractPlugin({
				filename: '[name].css',
				chunkFilename: (pathData) => {
					return '[name].css';
				},
			}),
		],
		//devtool: 'source-map',
		devServer: {
			// Serve index.html as the base
			static: resolveAppPath('./'),

			// Enable compression
			compress: true,

			// Enable hot reloading
			hot: false,

			host,

			port: 37291,

			allowedHosts: 'all',

			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods':
					'GET, POST, PUT, DELETE, PATCH, OPTIONS',
				'Access-Control-Allow-Headers':
					'X-Requested-With, content-type, Authorization',
			},
		},
	};
};
