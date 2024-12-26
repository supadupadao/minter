<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <p><i>SupaDupa</i><b>Minter</b></p>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <RouterLink to="/" class="navbar-item">
          Home
        </RouterLink>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            More
          </a>

          <div class="navbar-dropdown">
            <RouterLink to="/about" class="navbar-item">
              About
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            EN
          </a>

          <div class="navbar-dropdown">
            <a to="/about" class="navbar-item is-selected">
              EN
            </a>

            <a to="/about" class="navbar-item">
              RU
            </a>
          </div>
        </div>

        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-primary">
              <strong>Connect wallet</strong>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
