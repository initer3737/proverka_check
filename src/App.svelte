<script>
  import Router from "svelte-spa-router";
  import Home from "./routes/Home.svelte";
  import About from "./routes/About.svelte";

  // Definisi mapping route yang rapi
  const routes = {
    "/": Home,
    "/about": About
  };
</script>

<!-- Navigation Bar menggunakan tag anchor biasa dengan '#' -->
<nav class="p-4 flex gap-4 ">
  {#each Object.keys(routes) as route }
    <a href="#{route}" class="hover:text-blue-400">{route=="/"?"home":route.replace("/","")}</a>
  {/each}
  
</nav>

<main class="p-6">
  <!-- Cukup panggil komponen Router bawaan dengan memasukkan object routes -->
  <Router {routes} />
</main>

<footer>
  referensi
</footer>