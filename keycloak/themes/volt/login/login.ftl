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
  <main class="page-content">
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
              <#if (realm.rememberMe && !usernameHidden??) || realm.resetPasswordAllowed>
              <div class="preferences">
                <#if realm.rememberMe && !usernameHidden??>
                  <label class="remember"><input id="rememberMe" name="rememberMe" type="checkbox" <#if login.rememberMe??>checked</#if>> Zapamiętaj mnie</label>
                <#else><span></span></#if>
                <#if realm.resetPasswordAllowed><a href="${url.loginResetCredentialsUrl}">Nie pamiętasz hasła?</a></#if>
              </div>
              </#if>
              <#if auth.selectedCredential?has_content><input type="hidden" name="credentialId" value="${auth.selectedCredential}"></#if>
              <div class="submit-row"><button class="primary-button" id="kc-login" name="login" type="submit">Zaloguj się</button></div>
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
  </main>
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
