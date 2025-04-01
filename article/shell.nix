{
  pkgs ? import <nixpkgs> { },
}:
pkgs.mkShell {
  buildInputs = with pkgs; [
    pandoc_3_5
    haskellPackages.citeproc
    texlive.combined.scheme-full
    texliveTeTeX
  ];
}
