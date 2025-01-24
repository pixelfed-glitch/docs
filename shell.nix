{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  name = "pixelfed-nix-shell";
  buildInputs = with pkgs; [ act nodejs nodePackages.npm ];
  runScript = "$SHELL";
  shellHook = ''
      export PATH="$PWD/node_modules/.bin/:$PATH"
  '';
}
