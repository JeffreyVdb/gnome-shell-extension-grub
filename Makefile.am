ACLOCAL_AMFLAGS = -I m4 ${ACLOCAL_FLAGS}
SUBDIRS = po

## extension data
extensionurl = https://github.com/JeffreyVdb/gnome-shell-extension-grub
polkit_actiondir = $(datadir)/polkit-1/actions
topextensiondir = $(datadir)/gnome-shell/extensions
icondir = $(datadir)/icons/hicolor/scalable/actions
uuid = gnome-shell-grub@vandenbornejeffrey@gmail.com
extensiondir = $(topextensiondir)/$(uuid)

dist_icon_DATA = \
				data/icons/windows8.svg \
				data/icons/fedora.svg
dist_extension_DATA = src/extension.js src/convenience.js src/grubLoader.js data/stylesheet.css
dist_polkit_action_DATA = data/org.gnome-shell-extension-grub.grub2-set-default.policy
nodist_extension_DATA = data/metadata.json

EXTRA_DIST =  data/metadata.json.in

data/metadata.json: data/metadata.json.in $(top_builddir)/config.status
	$(AM_V_GEN) sed -e "s|[@]uuid@|$(uuid)|" \
			    -e "s|[@]gettext_package@|$(GETTEXT_PACKAGE)|" \
				-e "s|[@]localedir@|$(datadir)/locale|" \
				-e "s|[@]url@|$(extensionurl)|" $< > $@

CLEANFILES = data/metadata.json

gtk_update_icon_cache = gtk-update-icon-cache -f -t $(datadir)/icons/hicolor; gtk-update-icon-cache -f -t 


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

install-data-hook: update-icon-cache
	## set grub boot file to read permissions for all users
	chmod 644 /boot/grub2/grub.cfg 

update-icon-cache:
	@-if test -z "$(DESTDIR)"; then \
		echo "Updating Gtk icon cache"; \
		$(gtk_update_icon_cache); \
	else \
		echo "Cache not updated"; \
	fi
