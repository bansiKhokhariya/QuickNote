if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const r=e=>c(e,n),f={module:{uri:n},exports:t,require:r};s[n]=Promise.all(a.map((e=>f[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-07a7b4f2"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/1694556935741.jpeg",revision:"633ac434f68900545ce2a5e157cef257"},{url:"/2.svg",revision:"d756f01ad303c6cdc7c901fa98a6d734"},{url:"/Frame_1.svg",revision:"df14279ecb318a2f5268540701274ec2"},{url:"/_next/app-build-manifest.json",revision:"0c1cc00f18cf97fa9760a10fc39f23c6"},{url:"/_next/static/565cfYWukSBjQUP_Lmc_r/_buildManifest.js",revision:"2ec694eb52ae4f523f265a46bae4d768"},{url:"/_next/static/565cfYWukSBjQUP_Lmc_r/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/23-0a5e7888ef8f7a04.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/418-727dafd6333d3073.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/436-e52542fbcf3c325b.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/4c1c5963-caa8f2a57d8bf519.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/54a60aa6-8f8f9ebc9ac2c7ec.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/648-3828009c32fc79c4.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/70e0d97a-b52fe52a7fdf810c.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/796-f2a285dfa3a33c7b.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/849-3961292582121eae.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/874-0f4968e64eda3b9c.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/app/MyNotes/page-610c4e3524258fae.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/app/_not-found/page-31977ab0ba0c7179.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/app/edit/%5Bid%5D/page-99ad7b2f1639e9d5.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/app/layout-06ba8fa6074ae738.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/app/page-9ecb1c2b07953f54.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/fd9d1056-efe024214e382bde.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/framework-aec844d2ccbe7592.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/main-9b91ddc1d6f5193e.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/main-app-62610fa93344052a.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/pages/_app-6a626577ffa902a4.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/pages/_error-1be831200e60c5c0.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-edc128207d9cdb99.js",revision:"565cfYWukSBjQUP_Lmc_r"},{url:"/_next/static/css/6f25aa05d9e0c8ee.css",revision:"6f25aa05d9e0c8ee"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/android-chrome-192x192.png",revision:"a790609f22aecd069c9bdafc5ef1e719"},{url:"/android-chrome-512x512.png",revision:"e2526717f19878d906a04302e5229f24"},{url:"/apple-touch-icon.png",revision:"104fbe297d84fef74080a0e5b5771778"},{url:"/blog/introducing-supabase/header.png",revision:"235c9c94640bd410841ebff6931d2a44"},{url:"/browserconfig.xml",revision:"ca234b9d36d611aa6ad033876b1b39c2"},{url:"/favicon-16x16.png",revision:"d4a373192791985afc7cac098ed24a5c"},{url:"/favicon-32x32.png",revision:"4df23c062bd8f3fb6ad1bd1c03a77574"},{url:"/icons/icon.png",revision:"41f29d4ca68171eaf6489ce380b3a617"},{url:"/images/whatsapp.webp",revision:"ef257344f25163011cc9e6b9b4f7eeba"},{url:"/linkedin-color-svgrepo-com.svg",revision:"48882e80a7ef2080bac10edcfdc9c3e7"},{url:"/manifest.json",revision:"ffbaf91d4653f5f42c4d6fed6ebe65cf"},{url:"/mstile-150x150.png",revision:"ecabc31db6b36e9498db5c5993298ed5"},{url:"/personalized_recommendations.svg",revision:"477a318ecbe28a522dc4c09b7a761ef0"},{url:"/profile1.avif",revision:"4b80f28b406b24d5caff099655b6e80b"},{url:"/profile2.avif",revision:"9f151718d7a49cf212f3d6d7161150f2"},{url:"/reddit.svg",revision:"d3d9773f6bc7ef31a9a61ab48381b43d"},{url:"/review.mp4",revision:"35cb2491ca78b0d7b763b28ab74d478d"},{url:"/robots.txt",revision:"6384154aa5e8fc12a0de99fc2902084a"},{url:"/safari-pinned-tab.svg",revision:"4ac303891ff7ef82c3ce2c69bfeb5607"},{url:"/site.webmanifest",revision:"22a36b7df2717d75493d9174d28391be"},{url:"/sitemap-0.xml",revision:"c2181f0d73484401e12714d4bff93d06"},{url:"/sitemap.xml",revision:"9a2988718f8a55ec0c36e6cbb3d0a7bb"},{url:"/svg/facebook.svg",revision:"1e8cff96499a6ae94584c5af20605e10"},{url:"/svg/telegram.svg",revision:"0e55904e4eac11f144421fa140b11d6b"},{url:"/svg/twitter.svg",revision:"5619d9496737ac81a915fe4b794d8e59"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
