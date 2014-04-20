ACLOCAL_AMFLAGS = -I m4 ${ACLOCAL_FLAGS}
SUBDIRS = po

## extension data
extensionurl = https://github.com/JeffreyVdb/gnome-shell-extension-grub
topextensiondir = $(datadir)/gnome-shell/extensions
uuid = gnome-shell-grub@vandenbornejeffrey@gmail.com
extensiondir = $(topextensiondir)/$(uuid)

dist_extension_DATA = src/extension.js src/convenience.js data/stylesheet.css
nodist_extension_DATA = data/metadata.json

EXTRA_DIST = config/config.rpath m4/ChangeLog  data/metadata.json.in

data/metadata.json: data/metadata.json.in $(top_builddir)/config.status
	$(AM_V_GEN) sed -e "s|[@]uuid@|$(uuid)|" \
			    -e "s|[@]gettext_package@|$(GETTEXT_PACKAGE)|" \
				-e "s|[@]localedir@|$(datadir)/locale|" \
				-e "s|[@]url@|$(extensionurl)|" $< > $@

CLEANFILES = data/metadata.json


dist-hook: dist-changelog
.PHONY: dist-changelog
dist-changelog:
	$(AM_V_at)if git --git-dir=$(top_srcdir)/.git --work-tree=$(top_srcdir) \
		log --no-merges --pretty='tformat:%cd  %an  <%ae>%n%n%s%n%n%b'  --date=short | \
	 $(SED)	-e '/^[12]...-[01].-[0123].  [^<>]*  <[^<>]*>$$/,/^$$/ b' \
		-e '/[^	 ]/,/^[	 ]*$$/ !d' \
		-e 's/^[	 ]*/	/' \
		-e 's/^[	 ]*$$//' >.ChangeLog.tmp; \
	then mv -f .ChangeLog.tmp "$(top_distdir)/ChangeLog"; \
	else rm -f .ChangeLog.tmp; exit 1; fi