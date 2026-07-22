 <script>
  import { onMount } from 'svelte';
  import * as pdfjsLib from 'pdfjs-dist';

  // Set worker PDF.js - versi cocok dengan pdfjs-dist di node_modules (6.1.200)
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.1.200/pdf.worker.min.mjs";

  const baseUrl = import.meta.env.BASE_URL || '/';

  // Build URL with base path prefix + encodeURI for spaces
  function buildPdfUrl(rawPath) {
    if (!rawPath) return '';
    const pathOnly = `${baseUrl}${rawPath}`.replace(/\/+/g, '/');
    return `${window.location.origin}${encodeURI(pathOnly)}`;
  }

  let { pdfUrl = '/informasi/10.hoax/documents/documents/english/clarification_document_advanced english.pdf' } = $props();
  
  let containerEl;
  let loading = $state(true);
  let errorMessage = $state('');
  let totalPages = $state(0);

  async function renderAllPages() {
    if (!containerEl) return;

    try {
      loading = true;
      errorMessage = '';
      containerEl.innerHTML = '';

      const fullUrl = buildPdfUrl(pdfUrl);
      const loadingTask = pdfjsLib.getDocument({ url: fullUrl });
      const pdf = await loadingTask.promise;
      totalPages = pdf.numPages;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.2 });
        
        const canvas = document.createElement('canvas');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.className = 'block mx-auto my-2 shadow-md';
        
        containerEl.appendChild(canvas);

        const context = canvas.getContext('2d');
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
      }
      
      loading = false;
    } catch (err) {
      errorMessage = 'Gagal memuat PDF: ' + err.message;
      console.error("PDF error:", err);
      loading = false;
    }
  }

  $effect(() => {
    if (containerEl && pdfUrl) {
      renderAllPages();
    }
  });
</script>

{#if loading}
  <p class="text-gray-500">Memuat dokumen... {totalPages > 0 ? `(${totalPages} halaman)` : ''}</p>
{/if}

{#if errorMessage}
  <div class="p-3 text-red-600 border border-red-200 rounded bg-red-50">
    <p>{errorMessage}</p>
    <a href={buildPdfUrl(pdfUrl)} target="_blank" rel="noreferrer" class="inline-block mt-1 text-blue-600 underline">📥 Download PDF langsung</a>
  </div>
{/if}

<div bind:this={containerEl} style:display={loading || errorMessage ? 'none' : 'block'}></div>

<h1 class="mt-4 text-3xl font-bold text-purple-600">About Page</h1>
<p class="mt-2 text-gray-600">This page uses Svelte Routing.</p>
