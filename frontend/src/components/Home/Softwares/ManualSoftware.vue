<template>
  <div class="flex flex-col items-start justify-start w-full">
    <h2 class="m-6 text-4xl font-semibold">
      {{ software }}
    </h2>

    <p class="mt-3">
      Because the amount of licenses for this software is limited, you must contact Systems Administration in order to retrieve a license.
      Please contact via <a href="mailto:suporte@dem.tecnico.ulisboa.pt">suporte@dem.tecnico.ulisboa.pt</a>. Describe your use case
      and if applied, responsible professor. You might be asked to use the software by connecting to a remote workstation.
    </p>
  </div>
</template>

<script>
  export default {
    name: 'ManualSoftware',
    components: {},
    props: {
      software: String,
    },
  }
</script>
