// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';

// export default defineConfig({
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://wedding-plannerback-shanukafer98s-projects.vercel.app',
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


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
  },
  define: {
    'process.env.VITE_BACKEND_URL': JSON.stringify('https://wedding-plannerback-ge2a313u1-shanukafer98s-projects.vercel.app'),
  },
});