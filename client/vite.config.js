import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import postcss from 'postcss';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss,
  },
  server: {
    open: true, 
  },
})
