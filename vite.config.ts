import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
export default defineConfig({
	base: './',
	plugins: [
		vue(),
		VueSetupExtend(),
		AutoImport({
			resolvers: [ElementPlusResolver()]
		}),
		Components({
			resolvers: [ElementPlusResolver()]
		})
	],
	optimizeDeps: {
		include: ['schart.js']
	},
	resolve: {
		alias: {
			'@': '/src',
			'~': '/src/assets'
		}
	},	
	// 配置开发服务器
	server:{
		host:true,
		open: false,
		cors: true,
		port:3333,
		proxy:{
			'/api':{
				target:"http://127.0.0.1:8000",
				ws:true,
				// 是否允许跨域
				changeOrigin:true
			}
		}

	},
	define: {
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true",
	},
});
