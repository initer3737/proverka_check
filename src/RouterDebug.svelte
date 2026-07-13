<script>
  import { page } from 'svelte-routing';
  $: pathname = $page?.path ?? '(no path)';
</script>

<pre style="padding:12px;border:1px dashed #999;">{$page?.pathname} | {pathname}</pre>

