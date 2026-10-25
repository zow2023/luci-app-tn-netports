/*
 * Copyright (c) 2019, Tano Systems. All Rights Reserved.
 * Anton Kikin <a.kikin@tano-systems.com>
 * OpenWrt 25.12 adaptation: ucode rpcd backend, ubus-based port state.
 */

'use strict';
'require rpc';
'require uci';
'require netports';

const callSessionAccess = rpc.declare({
	object: 'session',
	method: 'access',
	params: [ 'scope', 'object', 'function' ],
	expect: { 'access': false }
});

const callNetPortsGetInfo = rpc.declare({
	object: 'netports',
	method: 'getPortsInfo',
	expect: { '': {} }
});

var netports_el = null;
var netports_object = null;

return L.Class.extend({
	__init__: function() {
		netports_el = E('div', {});

		uci.load('luci_netports').then(function() {
			var np_default_additional_info =
				parseInt(uci.get('luci_netports', 'global', 'default_additional_info') || 0) == 1;

			var np_default_h_mode =
				parseInt(uci.get('luci_netports', 'global', 'default_h_mode') || 1) == 1;

			var np_hv_mode_switch_button =
				parseInt(uci.get('luci_netports', 'global', 'hv_mode_switch_button') || 1) == 1;

			netports_object = new netports.NetPorts({
				target: netports_el,
				mode: np_default_h_mode ? 0 : 1,
				modeSwitchButton: np_hv_mode_switch_button,
				autoSwitchHtoV: true,
				autoSwitchHtoVThreshold: 6,
				hModeFirstColWidth: 20,
				hModeExpanded: np_default_additional_info,
			});
		});
	},

	title: _('Network Interfaces Ports Status'),

	load: function() {
		return Promise.all([
			L.resolveDefault(callNetPortsGetInfo(), {}),
			L.resolveDefault(callSessionAccess('access-group', 'luci-app-tn-netports', 'read'), false)
		]);
	},

	render: function(data) {
		var hasReadPermission = data[1];

		if (!hasReadPermission)
			return E([]);

		/* Load the stylesheet once, scoped to this include's own element */
		if (!document.getElementById('netports-css')) {
			var css = E('link', {
				'id': 'netports-css',
				'href': L.resource('netports/netports.css'),
				'rel': 'stylesheet'
			});

			document.head.appendChild(css);
		}

		/* `this` is the include object here; netports_el is module scope */
		if (netports_object)
			netports_object.updateData(data[0]);

		return E([ netports_el ]);
	}
});
