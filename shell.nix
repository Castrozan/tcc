{
  pkgs ? import <nixpkgs> { },
}:
pkgs.mkShell {
  buildInputs = with pkgs; [
    pandoc
    haskellPackages.citeproc
    texlive.combined.scheme-full
    texliveTeTeX
  ];
}
