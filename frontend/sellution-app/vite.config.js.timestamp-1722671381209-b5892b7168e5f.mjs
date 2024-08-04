// vite.config.js
import { defineConfig } from "file:///C:/Users/KOSA/Desktop/3rd_PJT/PJT/version2/Sellution/frontend/sellution-app/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/KOSA/Desktop/3rd_PJT/PJT/version2/Sellution/frontend/sellution-app/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcss from "file:///C:/Users/KOSA/Desktop/3rd_PJT/PJT/version2/Sellution/frontend/sellution-app/node_modules/tailwindcss/lib/index.js";
import path from "path";
import { fileURLToPath } from "url";
var __vite_injected_original_import_meta_url = "file:///C:/Users/KOSA/Desktop/3rd_PJT/PJT/version2/Sellution/frontend/sellution-app/vite.config.js";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = path.dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }]
  },
  server: {
    proxy: {
      // S3 버킷에 대한 프록시 설정 추가
      "/s3-bucket": {
        // target: 'https://t1-back-s3.s3.ap-northeast-2.amazonaws.com',
        target: "https://dn4dz12f3344k.cloudfront.net",
        changeOrigin: true,
        secure: false,
        rewrite: (path2) => path2.replace(/^\/s3-bucket/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxLT1NBXFxcXERlc2t0b3BcXFxcM3JkX1BKVFxcXFxQSlRcXFxcdmVyc2lvbjJcXFxcU2VsbHV0aW9uXFxcXGZyb250ZW5kXFxcXHNlbGx1dGlvbi1hcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEtPU0FcXFxcRGVza3RvcFxcXFwzcmRfUEpUXFxcXFBKVFxcXFx2ZXJzaW9uMlxcXFxTZWxsdXRpb25cXFxcZnJvbnRlbmRcXFxcc2VsbHV0aW9uLWFwcFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvS09TQS9EZXNrdG9wLzNyZF9QSlQvUEpUL3ZlcnNpb24yL1NlbGx1dGlvbi9mcm9udGVuZC9zZWxsdXRpb24tYXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICd0YWlsd2luZGNzcyc7XHJcblxyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XHJcblxyXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xyXG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoX19maWxlbmFtZSk7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICBjc3M6IHtcclxuICAgIHBvc3Rjc3M6IHtcclxuICAgICAgcGx1Z2luczogW3RhaWx3aW5kY3NzKCldLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiBbeyBmaW5kOiAnQCcsIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJykgfV0sXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHByb3h5OiB7XHJcbiAgICAgIC8vIFMzIFx1QkM4NFx1RDBCN1x1QzVEMCBcdUIzMDBcdUQ1NUMgXHVENTA0XHVCODVEXHVDMkRDIFx1QzEyNFx1QzgxNSBcdUNEOTRcdUFDMDBcclxuICAgICAgJy9zMy1idWNrZXQnOiB7XHJcbiAgICAgICAgLy8gdGFyZ2V0OiAnaHR0cHM6Ly90MS1iYWNrLXMzLnMzLmFwLW5vcnRoZWFzdC0yLmFtYXpvbmF3cy5jb20nLFxyXG4gICAgICAgIHRhcmdldDogJ2h0dHBzOi8vZG40ZHoxMmYzMzQ0ay5jbG91ZGZyb250Lm5ldCcsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3MzLWJ1Y2tldC8sICcnKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdWEsU0FBUyxvQkFBb0I7QUFDcGMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBRXhCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHFCQUFxQjtBQUxtUCxJQUFNLDJDQUEyQztBQU9sVSxJQUFNLGFBQWEsY0FBYyx3Q0FBZTtBQUNoRCxJQUFNLFlBQVksS0FBSyxRQUFRLFVBQVU7QUFHekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLFNBQVMsQ0FBQyxZQUFZLENBQUM7QUFBQSxJQUN6QjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU8sQ0FBQyxFQUFFLE1BQU0sS0FBSyxhQUFhLEtBQUssUUFBUSxXQUFXLEtBQUssRUFBRSxDQUFDO0FBQUEsRUFDcEU7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQTtBQUFBLE1BRUwsY0FBYztBQUFBO0FBQUEsUUFFWixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsUUFDUixTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxnQkFBZ0IsRUFBRTtBQUFBLE1BQ3BEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
