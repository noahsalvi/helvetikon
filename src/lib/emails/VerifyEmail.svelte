<script>
  import { dev } from "$app/env";

  import EmailDefaultLayout from "./EmailDefaultLayout.svelte";

  export let user;
  export let token;

  const href = `${
    dev ? "http://localhost:3000" : "https://www.helvetikon.org"
  }/verifizieren?token=${token}`;
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
  <tr>
    <td style="height:100px" />
  </tr>
  <tr>
    <td align="center">
      <a class="verify-button" {href}>E-Mail verifizieren</a>
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
