<script>
  import EmailDefaultLayout from "./EmailDefaultLayout.svelte";

  export let link = "https://google.com";
  export let user;
</script>

<EmailDefaultLayout title="E-Mail verifizieren">
  <tr>
    <td>
      <p>
        Hallo {user?.username}
        <br /><br />
        Um deine Registrierung abzuschliessen, musst du noch deine E-Mail-Adresse
        verifizieren.
        <br />
        Klicke auf den folgenden Link.
      </p>
    </td>
  </tr>
  <tr style="height:100px" />
  <tr>
    <td align="center">
      <a class="verify-button" href={link}>E-Mail verifizieren</a>
    </td>
  </tr>
</EmailDefaultLayout>

<style>
  .verify-button {
    background: #ce1818;
    color: white;
    padding: 16px 30px;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
