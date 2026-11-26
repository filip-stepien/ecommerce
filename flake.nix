{
  inputs = {
    utils.url = "github:numtide/flake-utils";
  };
  outputs =
    {
      self,
      nixpkgs,
      utils,
    }:
    utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {

          buildInputs = with pkgs; [
            plantuml
            go-task
            jdk
            nodejs
            pnpm
            typst
          ];
          PLAYWRIGHT_BROWSERS_PATH = pkgs.playwright-driver.browsers;
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1";
          PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";
          shellHook = ''
            task
          '';
        };
      }
    );
}
