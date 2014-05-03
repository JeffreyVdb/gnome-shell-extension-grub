ACLOCAL_AMFLAGS = -I m4 ${ACLOCAL_FLAGS}
SUBDIRS = po

## extension data
extensionurl = https://github.com/JeffreyVdb/gnome-shell-extension-grub
polkit_actiondir = $(datadir)/polkit-1/actions
topextensiondir = $(datadir)/gnome-shell/extensions
icondir = $(datadir)/icons/hicolor/scalable/actions
uuid = gnome-shell-grub@vandenbornejeffrey@gmail.com
extensiondir = $(topextensiondir)/$(uuid)
localextensiondir = $(HOME)/.local/share/gnome-shell/extensions
GRUB_CFG_PATH = $(shell \
				find /boot/grub /boot/grub2 -iname 'grub.cfg' 2>/dev/null|head -n1)

dist_icon_DATA = \
				data/icons/windows8.svg \
				data/icons/fedora.svg \
				data/icons/debian.svg
				
dist_extension_DATA = src/extension.js src/convenience.js src/grubLoader.js data/stylesheet.css
nodist_polkit_action_DATA = data/org.gnome-shell-extension-grub.grub2-set-default.policy
nodist_extension_DATA = data/metadata.json src/config.js

EXTRA_DIST =  	data/metadata.json.in \
				src/config.js.in \
				data/org.gnome-shell-extension-grub.grub2-set-default.policy.in

data/org.gnome-shell-extension-grub.grub2-set-default.policy: data/org.gnome-shell-extension-grub.grub2-set-default.policy.in \
	$(top_builddir)/config.status
	$(AM_V_GEN) sed -e "s|[@]grub_set_default_cmd@|$(GRUB_SET_DEFAULT)|" \
				$< > $@

data/metadata.json: data/metadata.json.in $(top_builddir)/config.status
	$(AM_V_GEN) sed -e "s|[@]uuid@|$(uuid)|" \
			    -e "s|[@]gettext_package@|$(GETTEXT_PACKAGE)|" \
				-e "s|[@]localedir@|$(localedir)|" \
				-e "s|[@]url@|$(extensionurl)|" $< > $@

src/config.js: src/config.js.in $(top_builddir)/config.status
	$(AM_V_GEN) sed -e "s|[@]grub_location@|$(GRUB_CFG_PATH)|" \
	   				-e "s|[@]pkexec_cmd@|$(PKEXEC)|" \
	   				-e "s|[@]grub_set_default_cmd@|$(GRUB_SET_DEFAULT)|" $< > $@

CLEANFILES = data/metadata.json \
			 src/config.js \
			 data/org.gnome-shell-extension-grub.grub2-set-default.policy

clean-local:
	-rm -rf $(builddir)/dist

gtk_update_icon_cache = gtk-update-icon-cache -f -t $(datadir)/icons/hicolor; gtk-update-icon-cache -f -t 

zip-file: all
	@echo 'creating zip distribution file'
	@-rm -rf $(builddir/_build) \
	rm -rf $(builddir/dist) \
	$(MKDIR_P) $(builddir)/_build; \
	$(MKDIR_P) $(builddir)/dist; \
	$(MAKE) install DESTDIR="$(abs_builddir)/_build"; \
	cp -r "$(builddir)/_build$(datadir)/gnome-shell/extensions/$(uuid)" "$(builddir)/_build"; \
	cp -r "$(builddir)/_build$(datadir)/locale" "$(builddir)/_build/$(uuid)"; \
	(cd "$(builddir)/_build/$(uuid)/"; \
		 zip -qr "$(abs_builddir)/dist/$(uuid).zip" .; \
	); \
	rm -rf $(builddir)/_build

local-install: zip-file
	@echo 'installing zip file'
	@-zip_file="$(abs_builddir)/dist/$(uuid).zip"; \
	if [ -d "$(localextensiondir)/$(uuid)" ]; then \
		rm -fr "$(localextensiondir)/$(uuid)"; \
	fi; \
	$(MKDIR_P) $(localextensiondir)/$(uuid); \
	(cd $(localextensiondir)/$(uuid); \
		unzip -q $${zip_file}; \
	);
	
local-uninstall: 
	-rm -rf "$(localextensiondir)/$(uuid)"

dist-hook: dist-changelog
.PHONY: dist-changelog
dist-changelog:
	$(AM_V_at)if git --git-dir=$(top_srcdir)/.git --work-tree=$(top_srcdir) \
		log --no-merges --pretty='tformat:%cd  %an  <%ae>%n%n%s%n%n%b'  --date=short v1.0.. | \
	 $(SED)	-e '/^[12]...-[01].-[0123].  [^<>]*  <[^<>]*>$$/,/^$$/ b' \
		-e '/[^	 ]/,/^[	 ]*$$/ !d' \
		-e 's/^[	 ]*/	/' \
		-e 's/^[	 ]*$$//' >.ChangeLog.tmp; \
	then mv -f .ChangeLog.tmp "$(top_distdir)/ChangeLog"; \
	else rm -f .ChangeLog.tmp; exit 1; fi

install-data-hook: update-icon-cache
	## set grub boot file to read permissions for all users
	chmod 644 $(GRUB_CFG_PATH)

update-icon-cache:
	@-if test -z "$(DESTDIR)"; then \
		echo "Updating Gtk icon cache"; \
		$(gtk_update_icon_cache); \
	else \
		echo "Cache not updated"; \
	fi
