AC_PREREQ(2.63)
AC_INIT([gnome-shell-extension-grub],[1.0],[https://github.com/JeffreyVdb/gnome-shell-extension-grub/issues])

AC_CONFIG_AUX_DIR([config])
AC_CONFIG_MACRO_DIR([m4])

AM_INIT_AUTOMAKE([1.10 dist-xz no-dist-gzip foreign tar-ustar])
m4_ifdef([AM_SILENT_RULES],[AM_SILENT_RULES([yes])])

AC_PROG_SED

GETTEXT_PACKAGE=gnome-shell-extension-grub
AC_SUBST(GETTEXT_PACKAGE)
AC_DEFINE_UNQUOTED(GETTEXT_PACKAGE, "$GETTEXT_PACKAGE",
                   [The prefix for our gettext translation domains.])
IT_PROG_INTLTOOL(0.26)
PKG_PROG_PKG_CONFIG([0.22])

AC_CONFIG_FILES([
  Makefile
  po/Makefile.in
])

AC_OUTPUT
