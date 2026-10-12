<#import "passkeys.ftl" as passkeys>
<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Logowanie · volt</title>
  <link rel="stylesheet" href="${url.resourcesPath}/css/volt.css">
</head>
<body>
  <header class="site-header">
    <div class="service-strip">
      <span>Technologia na co dzień. Dostawa od 14,99 zł · 30 dni na zwrot</span>
      <span>Pomoc i kontakt&nbsp; · &nbsp;800 100 200</span>
    </div>
    <div class="main-navigation">
      <a class="brand" href="http://localhost:5173/" aria-label="volt — strona główna">
        <img src="${url.resourcesPath}/img/zap.svg" alt="" width="27" height="27"><span>volt</span>
      </a>
      <div class="search-preview" aria-hidden="true"><span>Szukaj produktów, marek i kategorii...</span><img src="${url.resourcesPath}/img/search.svg" alt="" width="20" height="20"></div>
      <div class="account-actions">
        <img src="${url.resourcesPath}/img/heart.svg" alt="" width="20" height="20">
        <span class="account-action"><img src="${url.resourcesPath}/img/user-round.svg" alt="" width="20" height="20">Zaloguj się</span>
        <span class="account-action"><img src="${url.resourcesPath}/img/shopping-bag.svg" alt="" width="20" height="20">Koszyk <span class="cart-count">4</span></span>
      </div>
    </div>
    <nav class="categories" aria-label="Kategorie sklepu">
      <a href="http://localhost:5173/">Wszystkie produkty</a><span>Komputery</span><span>Smartfony</span><span>Audio</span><span>Akcesoria</span><span>Nowości</span><span class="accent">Oferty dla Ciebie</span>
    </nav>
  </header>

  <main class="page-content">
    <div class="breadcrumb">Strona główna / Logowanie</div>
    <div class="experience">
      <section class="sign-in" aria-labelledby="welcome-title">
        <div class="welcome">
          <span class="badge">Twoje konto volt</span>
          <h1 id="welcome-title">Dobrze Cię widzieć.</h1>
          <p>Zaloguj się, aby sprawdzić zamówienia, śledzić przesyłki i korzystać z ofert dla Ciebie.</p>
        </div>
        <div class="form-card">
          <#if message?has_content && message.type != 'warning'>
            <div class="message message-${message.type}" role="alert">${kcSanitize(message.summary)?no_esc}</div>
          </#if>
          <#if realm.password>
            <form id="kc-form-login" action="${url.loginAction}" method="post">
              <#if !usernameHidden??>
                <div class="field">
                  <label for="username">Adres e-mail</label>
                  <input id="username" name="username" type="text" value="${(login.username!'')}" placeholder="anna.kowalska@gmail.com" autocomplete="username" autofocus aria-invalid="<#if messagesPerField.existsError('username','password')>true<#else>false</#if>">
                </div>
              <#else>
                <div class="known-user">${(auth.attemptedUsername!'')} <a href="${url.loginRestartFlowUrl}">Zmień konto</a></div>
              </#if>
              <div class="field">
                <label for="password">Hasło</label>
                <div class="password-control">
                  <input id="password" name="password" type="password" autocomplete="current-password" aria-invalid="<#if messagesPerField.existsError('username','password')>true<#else>false</#if>">
                  <button id="password-toggle" type="button" aria-label="Pokaż hasło" aria-pressed="false"><img src="${url.resourcesPath}/img/eye.svg" alt="" width="18" height="18"></button>
                </div>
              </div>
              <#if messagesPerField.existsError('username','password')>
                <div class="field-error" role="alert">${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}</div>
              </#if>
              <div class="preferences">
                <#if realm.rememberMe && !usernameHidden??>
                  <label class="remember"><input id="rememberMe" name="rememberMe" type="checkbox" <#if login.rememberMe??>checked</#if>> Zapamiętaj mnie</label>
                <#else><span></span></#if>
                <#if realm.resetPasswordAllowed><a href="${url.loginResetCredentialsUrl}">Nie pamiętasz hasła?</a></#if>
              </div>
              <#if auth.selectedCredential?has_content><input type="hidden" name="credentialId" value="${auth.selectedCredential}"></#if>
              <button class="primary-button" id="kc-login" name="login" type="submit">Zaloguj się</button>
            </form>
          </#if>
          <#if realm.password && social?? && social.providers?has_content>
            <div class="divider"><span>lub</span></div>
            <div class="social-providers">
              <#list social.providers as provider>
                <a class="outline-button" href="${provider.loginUrl}">Kontynuuj z ${provider.displayName!provider.alias}</a>
              </#list>
            </div>
          </#if>
          <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
            <p class="register">Nie masz konta? <a href="${url.registrationUrl}">Załóż konto</a></p>
          </#if>
        </div>
        <div class="secure-note"><img src="${url.resourcesPath}/img/shield-check.svg" alt="" width="18" height="18"><p>Bezpieczne połączenie szyfrowane. Nie udostępniamy Twoich danych i nigdy nie prosimy o hasło do banku.</p></div>
      </section>
      <aside class="benefits" aria-label="Korzyści z konta volt">
        <img class="lifestyle-photo" src="${url.resourcesPath}/img/connected-desk.png" alt="Laptop i słuchawki na biurku">
        <h2>Więcej niż zakupy.<br>Twoja technologia, po Twojemu.</h2>
        <ul>
          <li><span class="benefit-icon"><img src="${url.resourcesPath}/img/package.svg" alt="" width="20" height="20"></span><span><strong>Zamówienia zawsze pod ręką</strong><small>Sprawdzaj status i śledź każdą przesyłkę.</small></span></li>
          <li><span class="benefit-icon"><img src="${url.resourcesPath}/img/gift.svg" alt="" width="20" height="20"></span><span><strong>Oferty dopasowane do Ciebie</strong><small>Korzystaj z rabatów na podstawie swoich zakupów.</small></span></li>
          <li><span class="benefit-icon"><img src="${url.resourcesPath}/img/map-pin.svg" alt="" width="20" height="20"></span><span><strong>Szybsze kolejne zakupy</strong><small>Zapisane adresy ułatwiają składanie zamówień.</small></span></li>
        </ul>
      </aside>
    </div>
  </main>
  <footer class="site-footer"><span>© 2026 volt · Technologia bliżej Ciebie</span><span>Pomoc i kontakt&nbsp;&nbsp;&nbsp; Dostawa i zwroty&nbsp;&nbsp;&nbsp; Regulamin&nbsp;&nbsp;&nbsp; Prywatność</span><span class="payments"><img src="${url.resourcesPath}/img/shield-check-footer.svg" alt="" width="16" height="16">Bezpieczne płatności</span></footer>
  <@passkeys.conditionalUIData />
  <script>
    const toggle = document.getElementById('password-toggle');
    toggle?.addEventListener('click', () => {
      const input = document.getElementById('password');
      const visible = input.type === 'password';
      input.type = visible ? 'text' : 'password';
      toggle.setAttribute('aria-label', visible ? 'Ukryj hasło' : 'Pokaż hasło');
      toggle.setAttribute('aria-pressed', String(visible));
    });
  </script>
</body>
</html>
