<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import PlainFooter from "$lib/components/headers/PlainFooter.svelte";
</script>

<PlainHeader></PlainHeader>
  
<div id="outer">
  <h1>Pricing</h1>

  <p> Start for free. Upgrade for the fancy stuff.</p>

  <table>
    <thead>
      <tr>
        <th></th>
        <th>
          Free <sl-button class="action" size="small" pill>Literally $0</sl-button>
        </th>
        <th>
          Basic <sl-button class="action" size="small" pill>$9/mo</sl-button>
        </th>
        <th>
          Standard <sl-button class="action" size="small" pill>$29/mo</sl-button>
        </th>
        <th>
          Professional <sl-button class="action" size="small" pill>$79/mo</sl-button>
        </th>
        <th>
          Advanced <sl-button class="action" size="small" pill>$139/mo</sl-button>
        </th>
        <th>
          Enterprise <sl-button class="action" size="small" pill>Contact Us</sl-button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Subscribers</td>
        <td>Up to 100</td>
        <td>Up to 1,000</td>
        <td>Up to 5,000</td>
        <td>Up to 10,000</td>
        <td>Up to 20,000</td>
        <td>Unlimited</td>
      </tr>
      <tr>
        <td>Scheduling</td>
        <td><sl-icon src="/icons/check2-circle.svg"></sl-icon></td>
        <td><sl-icon src="/icons/check2-circle.svg"></sl-icon></td>
        <td><sl-icon src="/icons/check2-circle.svg"></sl-icon></td>
        <td><sl-icon src="/icons/check2-circle.svg"></sl-icon></td>
        <td><sl-icon src="/icons/check2-circle.svg"></sl-icon></td>
        <td><sl-icon src="/icons/check2-circle.svg"></sl-icon></td>
      </tr>
    </tbody>
  </table>

  <div class="vertical-spacer"></div>
  <PlainFooter></PlainFooter>
</div>

<style>
  #outer {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  #outer > h1 {
    text-align: center;
  }

  #outer > p {
    text-align: center;
  }

  h1 {
    font-family: "Roboto";
    font-size: 72px;
    font-weight: 900;
    padding-bottom: 9.6px;
    margin-bottom: 1rem;
  }

  h2 {
    font-family: "Roboto";
    font-size: 60px;
    font-weight: 900;
    padding-bottom: 9.6px;
    margin-top: 80px;
    margin-bottom: 80px;
  }

  h3 {
    font-family: "Roboto";
    font-size: 24px;
    font-weight: 900;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 20px;
    line-height: 32px;
    margin-top: 0;
    margin-bottom: 40px;
  }

  .vertical-spacer {
    flex: 1 1 100%;
    min-height: 1rem;
  }

  table {
    max-width: 50rem;
  }

  table tr {
    display: flex;
  }

  table th {
    font-weight: 900;
    display: flex;
    flex-direction: column;
  }

  table tr th,
  table tr td {
    width: 7rem;
    text-align: center;
  }

  table tr th:nth-child(1),
  table tr td:nth-child(1) {
    width: 10rem;
  }

  table th,
  table td {
    padding: 1rem 0.5rem;
  }

  sl-button::part(label) {
    padding-inline: 12px;
  }

</style>
