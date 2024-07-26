// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';

// export default defineConfig({
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://13.49.80.197:3000',
//         changeOrigin: true,
//         secure:true, // Disable SSL certificate validation if necessary
//       },
//     },
//   },
//   build: {
//     outDir: 'dist', // Ensure this matches your expected output directory
//   },
//   plugins: [react()],
// });


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';

// export default defineConfig({
//   plugins: [react()],
// });


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//   },
//   define: {
//     'process.env.VITE_BACKEND_URL': JSON.stringify('https://wedding-plannerback-ge2a313u1-shanukafer98s-projects.vercel.app'),
//   },
// });


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//   },
//   define: {
//     'process.env.VITE_BACKEND_URL': JSON.stringify('http://13.49.80.197:3000'),
//   },
// });


// vite.config.js or vite.config.ts
// import { defineConfig } from 'vite';

// export default defineConfig({
//   server: {
//     port: 5173,
//   },
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({

  plugins: [react()],
});
