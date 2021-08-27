<script>
  export let title;
</script>

<table id="parent">
  <tbody>
    <tr>
      <td align="center">
        <div class="card">
          <table class="frame">
            <tbody>
              <tr>
                <td>
                  <a class="logo" href="https://helvetikon.org">Helvetikon</a>
                </td>
              </tr>
              <tr>
                <td>
                  <h1>{title}</h1>
                </td>
              </tr>
              <slot />
              <tr>
                <td style="height:20px" />
              </tr>
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  </tbody>
</table>

<style global>
  #parent {
    width: 100%;
    font-family: Helvetica;
    background: white;
  }

  .card {
    width: 100%;
    max-width: 800px;
    margin-top: 20px;
    border-radius: 5px;
  }

  h1 {
    font-size: 36px;
    font-weight: 500;
  }

  .logo {
    font-size: 20px;
    font-weight: 800;
    color: #ce1818;
  }

  tr {
    vertical-align: top;
  }

  a {
    text-decoration: none;
  }
</style>
