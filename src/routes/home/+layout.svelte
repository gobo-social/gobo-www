<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte";
  import FooterNav from "$lib/components/headers/FooterNav.svelte";
  import NavPageTriple from "$lib/components/layouts/NavPageTriple.svelte";
  import GuardFrame from "$lib/components/GuardFrame.svelte";
</script>


<GuardFrame>
  <MainHeader></MainHeader>
  <NavPageTriple current="home">
    <slot slot="main"></slot>
  </NavPageTriple>
  <FooterNav current="home"></FooterNav>
</GuardFrame>