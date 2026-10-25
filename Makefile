# SPDX-License-Identifier: MIT
#
# Copyright (C) 2022-2024 muink <https://github.com/muink>
# Copyright (C) 2021 Tano Systems <https://github.com/tano-systems>

include $(TOPDIR)/rules.mk

LUCI_NAME:=luci-app-tn-netports
PKG_VERSION:=3.0.0
PKG_RELEASE:=1

LUCI_TITLE:=Network Interfaces Ports Status
LUCI_PKGARCH:=all
LUCI_DEPENDS:=\
	+luci-base \
	+rpcd-mod-ucode \
	+ucode \
	+ucode-mod-fs \
	+ucode-mod-uci \
	+ucode-mod-ubus

LUCI_DESCRIPTION:=Network ports status LuCI application (OpenWrt 25.12, ucode rpcd backend)

PKG_MAINTAINER:=Anya Lin <hukk1996@gmail.com>
PKG_LICENSE:=MIT

define Package/$(LUCI_NAME)/conffiles
/etc/config/luci_netports
endef

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
