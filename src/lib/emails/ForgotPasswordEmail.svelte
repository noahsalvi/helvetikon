<script>
  import { dev } from "$app/env";

  import EmailDefaultLayout from "./EmailDefaultLayout.svelte";

  export let user;
  export let token;

  const href = `${
    dev ? "http://localhost:3000" : "https://www.helvetikon.org"
  }/auth/passwort-zurücksetzen?token=${token}`;
</script>

<EmailDefaultLayout title="Passwort vergessen?">
  <tr>
    <td>
      <p>
        Hallo {user?.username}
        <br /><br />
        Es scheint, dass du dein Passwort vergessen hast. Klicke auf den Knopf unten,
        um ein neues Passwort zu erfassen.
        <br />
        Falls es jemand anderes war, der diese Anfrage gemacht hat, kannst du dieses
        E&#8209;Mail ignorieren.
      </p>
    </td>
  </tr>
  <tr>
    <td style="height:100px" />
  </tr>
  <tr>
    <td align="center">
      <a class="verify-button" {href}>Passwort zurücksetzen</a>
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
