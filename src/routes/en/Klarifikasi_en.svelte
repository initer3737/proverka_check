 <script>
    import { onMount } from 'svelte';
    import { datas_information } from "../../data"
    import mammoth from "mammoth"
    import * as pdfjsLib from "pdfjs-dist"
    
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.1.200/pdf.worker.min.mjs"

    const baseUrl = import.meta.env.BASE_URL;

    function fixImagePath(path) {
        if (!path) return '';
        let cleanPath = decodeURI(path);
        let fullPath = `${baseUrl}/${cleanPath}`.replace(/\/+/g, '/');
        return encodeURI(fullPath);
    }

    function buildPdfUrl(rawPath) {
        if (!rawPath) return "";
        const pathOnly = `${baseUrl}${rawPath}`.replace(/\/+/g, "/");
        return `${window.location.origin}${encodeURI(pathOnly)}`;
    }

    async function renderPdfContainer(containerEl, file) {
        if (!containerEl) return;

        // Show loading text directly in container
        containerEl.innerHTML = '<p class="text-gray-500">Loading PDF...</p>';

        try {
            const url = buildPdfUrl(file);
            const loadingTask = pdfjsLib.getDocument({ url });
            const pdfDoc = await loadingTask.promise;

            // Clear loading text
            containerEl.innerHTML = '';

            for (let i = 1; i <= pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const containerWidth = containerEl.clientWidth || 600;
                const viewport = page.getViewport({ scale: 1 });
                const scale = Math.min(1.5, containerWidth / viewport.width);
                const scaledViewport = page.getViewport({ scale });

                const canvas = document.createElement('canvas');
                canvas.height = scaledViewport.height;
                canvas.width = scaledViewport.width;
                canvas.className = 'block mx-auto my-2 shadow-md';

                containerEl.appendChild(canvas);

                const ctx = canvas.getContext('2d');
                await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;
            }
        } catch (err) {
            containerEl.innerHTML = `
                <div class="p-2 text-red-600 rounded bg-red-50">
                    <p class="mb-1">Error: ${err.message || String(err)}</p>
                    <a href="${buildPdfUrl(file)}" target="_blank" rel="noreferrer" class="text-blue-600 underline">📥 Download PDF directly</a>
                </div>
            `;
            console.error("PDF error:", err);
        }
    }

    async function loadDocx(containerEl, file) {
        if (!containerEl) return;

        // Show loading text directly in container
        containerEl.innerHTML = '<p class="text-gray-500">Loading document...</p>';

        try {
            const url = fixImagePath(file);
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            containerEl.innerHTML = result.value;
        } catch (err) {
            containerEl.innerHTML = `<p class="text-red-500">Error loading document: ${err.message}</p>`;
        }
    }

    // After mount, find all containers and render
    onMount(() => {
        // Render all PDF containers
        document.querySelectorAll('[data-pdf-container]').forEach(el => {
            renderPdfContainer(el, el.dataset.pdfContainer);
        });

        // Load all DOCX containers
        document.querySelectorAll('[data-docx-container]').forEach(el => {
            loadDocx(el, el.dataset.docxContainer);
        });
    });
</script>
<div class="flex flex-col gap-3 p-4 mb-4">
    <img src={fixImagePath('/informasi/11.pengampun/an nisa 17 en.PNG')} alt="">
    <img src={fixImagePath('/informasi/11.pengampun/az zumar 53 en.PNG')} alt="">
</div>
<h1 class="text-xl">1."My entire prayer, my acts of worship, and my way of life—even unto my death—must not be associated with anything else. This is a direct command from Allah, and I (Prophet Muhammad) am the first to carry out and submit to this rule."</h1>
<h1 class="mt-3 mb-4 text-xl">**Consult an *ustadz* or an expert to avoid going astray, and remember to cross-check and filter information before sharing it.</h1>
{#each datas_information as data_info,idx}
    <h1>{idx+1} {data_info.en.title}</h1>
    {#if data_info.en.video}
        <video src={fixImagePath(data_info.en.video)} controls class="w-full max-w-2xl my-2">
            <track kind="captions" src="" label="No captions available" />
        </video>
    {/if}
    {#each data_info.en.img as img_data}
        {#if data_info.en.title =="allah"}
            <img src={fixImagePath(img_data)} alt={data_info.en.title} class="block w-full h-auto m-2" />
        {:else}
            <img src={fixImagePath(img_data)} alt={data_info.en.title} class="block w-full h-auto m-2 md:max-w-xl" />
        {/if}
        
    {/each}

    <div>
        {#each data_info.en.link as data_link}
           <div class="flex gap-3">
               <p>link </p>
               <a href={data_link} target="_blank" rel="noreferrer" class="hover:text-blue-800">
                    {data_link}
                </a>
           </div>
        {/each}
    </div>

    <!-- DOCX Documents - langsung tampil -->
    {#if data_info.en.docs && data_info.en.docs.length > 0}
        <div class="mt-2">
            <p class="font-semibold">📄 Dokumen (DOCX):</p>
            {#each data_info.en.docs as doc, docIdx}
                <div class="mt-2 ml-4">
                    <p class="text-sm font-medium text-gray-700">{doc.name}</p>
                    <div class="p-3 mt-1 border border-gray-300 rounded bg-gray-50">
                        <div data-docx-container={doc.file} class="docx-content min-h-8"></div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    <!-- PDF Documents - langsung tampil -->
    {#if data_info.en.pdf && data_info.en.pdf.length > 0}
        <div class="mt-2">
            <p class="font-semibold">📄 Dokumen (PDF):</p>
            {#each data_info.en.pdf as doc, pdfIdx}
                <div class="mt-2 ml-4">
                    <p class="text-sm font-medium text-gray-700">{doc.name}</p>
                    <div class="p-3 mt-1 border border-gray-300 rounded">
                        <div data-pdf-container={doc.file} class="w-full overflow-x-auto min-h-16"></div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    <hr class="m-2 text-blue-900" />
{/each}



