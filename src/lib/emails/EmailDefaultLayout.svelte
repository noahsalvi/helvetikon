<script>
  export let title;
</script>

<table id="parent">
  <tbody>
    <tr>
      <td>
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
    height: 100%;
    font-family: Helvetica;
  }

  .card {
    width: 100%;
    max-width: 800px;
    margin: 100px auto;
    padding: 20px;
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
    padding: 20px;
  }

  a {
    text-decoration: none;
  }
</style>
